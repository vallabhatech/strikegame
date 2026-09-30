const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);

const port = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
const rooms = new Map();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'strikezone-server',
    rooms: rooms.size,
  });
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 16 * 1024,
});

const sanitizeNickname = (value) =>
  typeof value === 'string'
    ? value.trim().replace(/\s+/g, ' ').slice(0, 24)
    : '';

const normalizeRoomCode = (value) =>
  typeof value === 'string' ? value.trim().toUpperCase() : '';

const createRoomCode = () => {
  let code;
  do {
    code = crypto.randomBytes(4).toString('base64url').slice(0, 6).toUpperCase();
  } while (rooms.has(code));
  return code;
};

const isMember = (room, socketId) =>
  room?.players.some((player) => player.id === socketId);

const isValidBoard = (board) =>
  Array.isArray(board) &&
  board.length === 5 &&
  board.every(
    (row) =>
      Array.isArray(row) &&
      row.length === 5 &&
      row.every((number) => Number.isInteger(number) && number >= 1 && number <= 25),
  );

const hasWinningLine = (board, strikes) => {
  if (!isValidBoard(board)) return false;

  for (let index = 0; index < 5; index += 1) {
    if (board[index].every((number) => strikes.has(number))) return true;
    if (board.every((row) => strikes.has(row[index]))) return true;
  }

  return (
    board.every((row, index) => strikes.has(row[index])) ||
    board.every((row, index) => strikes.has(row[4 - index]))
  );
};

const emitStartGame = (roomCode, room) => {
  io.to(roomCode).emit('startGame', {
    players: room.players.map((player) => player.nickname),
    turn: room.players[room.turn]?.nickname,
  });
};

io.on('connection', (socket) => {
  socket.on('createRoom', ({ nickname } = {}, callback = () => {}) => {
    const safeNickname = sanitizeNickname(nickname);

    if (!safeNickname) {
      callback({ error: 'A nickname is required.' });
      return;
    }

    const roomCode = createRoomCode();
    rooms.set(roomCode, {
      players: [{ id: socket.id, nickname: safeNickname }],
      boardStates: new Map(),
      strikes: new Set(),
      turn: 0,
      started: false,
    });

    socket.join(roomCode);
    callback({ roomCode });
  });

  socket.on('joinRoom', ({ roomCode, nickname } = {}, callback = () => {}) => {
    const safeNickname = sanitizeNickname(nickname);
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!safeNickname) {
      callback({ error: 'A nickname is required.' });
      return;
    }

    if (!/^[A-Z0-9]{6}$/.test(normalizedCode) || !room) {
      callback({ error: 'Room not found.' });
      return;
    }

    if (room.players.length >= 2) {
      callback({ error: 'Room is full.' });
      return;
    }

    room.players.push({ id: socket.id, nickname: safeNickname });
    room.started = true;
    socket.join(normalizedCode);
    callback({ ok: true });
    emitStartGame(normalizedCode, room);
  });

  socket.on('sendBoard', ({ roomCode, board } = {}) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room || !isMember(room, socket.id) || !isValidBoard(board)) return;

    room.boardStates.set(socket.id, board);

    if (room.boardStates.size === 2) {
      io.to(normalizedCode).emit('boardsReady');
    }
  });

  socket.on('strike', ({ roomCode, number } = {}) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room || !room.started || !isMember(room, socket.id)) return;
    if (!Number.isInteger(number) || number < 1 || number > 25) return;

    const currentPlayer = room.players[room.turn];
    if (!currentPlayer || currentPlayer.id !== socket.id) return;
    if (room.strikes.has(number)) return;

    room.strikes.add(number);
    room.turn = 1 - room.turn;

    io.to(normalizedCode).emit('strike', {
      number,
      nextTurn: room.players[room.turn]?.nickname,
    });

    for (const player of room.players) {
      const board = room.boardStates.get(player.id);
      if (board && hasWinningLine(board, room.strikes)) {
        io.to(normalizedCode).emit('win', { winner: player.nickname });
        room.finished = true;
        break;
      }
    }
  });

  socket.on('restartGame', ({ roomCode } = {}, callback = () => {}) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room || !isMember(room, socket.id) || room.players.length !== 2) {
      callback({ error: 'A two-player room is required to restart.' });
      return;
    }

    room.strikes.clear();
    room.boardStates.clear();
    room.turn = 0;
    room.finished = false;
    emitStartGame(normalizedCode, room);
    callback({ ok: true });
  });

  socket.on('disconnecting', () => {
    for (const roomCode of socket.rooms) {
      const room = rooms.get(roomCode);
      if (!room) continue;

      io.to(roomCode).emit('playerLeft');
      rooms.delete(roomCode);
    }
  });
});

server.listen(port, () => {
  console.log(`StrikeZone server listening on port ${port}`);
});
