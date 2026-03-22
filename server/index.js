const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let rooms = {};

io.on('connection', (socket) => {
  socket.on('createRoom', ({ nickname }, callback) => {
    const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    rooms[roomCode] = {
      players: [{ id: socket.id, nickname }],
      boardStates: {},
      turn: 0,
      started: false,
    };
    socket.join(roomCode);
    callback({ roomCode });
  });

  socket.on('joinRoom', ({ roomCode, nickname }, callback) => {
    const room = rooms[roomCode];
    if (!room || room.players.length >= 2) {
      callback({ error: 'Room not found or full' });
      return;
    }
    room.players.push({ id: socket.id, nickname });
    room.started = true;
    socket.join(roomCode);
    // Send start signal to both players
    io.to(roomCode).emit('startGame', {
      players: room.players.map((p) => p.nickname),
      turn: room.players[room.turn].nickname,
    });
  });

  socket.on('sendBoard', ({ roomCode, board }) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.boardStates[socket.id] = board;
    // When both boards are sent, notify ready
    if (Object.keys(room.boardStates).length === 2) {
      io.to(roomCode).emit('boardsReady');
    }
  });

  socket.on('strike', ({ roomCode, number }) => {
    const room = rooms[roomCode];
    if (!room) return;
    // Switch turn
    room.turn = 1 - room.turn;
    io.to(roomCode).emit('strike', { number, nextTurn: room.players[room.turn].nickname });
  });

  socket.on('win', ({ roomCode, winner }) => {
    io.to(roomCode).emit('win', { winner });
  });

  socket.on('disconnecting', () => {
    for (const roomCode of socket.rooms) {
      if (rooms[roomCode]) {
        io.to(roomCode).emit('playerLeft');
        delete rooms[roomCode];
      }
    }
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});