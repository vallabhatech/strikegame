import { useCallback, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';

type ServerError = { error?: string };

type StartGamePayload = {
  players: string[];
  turn: string;
};

type StrikePayload = {
  number: number;
  nextTurn: string;
};

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ??
  `${window.location.protocol}//${window.location.hostname}:4000`;

const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

const generateBoard = (): number[][] => {
  const numbers = Array.from({ length: 25 }, (_, index) => index + 1);

  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = numbers[index];
    numbers[index] = numbers[randomIndex] ?? current;
    numbers[randomIndex] = current;
  }

  return Array.from({ length: 5 }, (_, row) =>
    numbers.slice(row * 5, row * 5 + 5),
  );
};

const App = () => {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [board, setBoard] = useState<number[][]>([]);
  const [strikes, setStrikes] = useState<Set<number>>(new Set());
  const [players, setPlayers] = useState<string[]>([]);
  const [turn, setTurn] = useState('');
  const [winner, setWinner] = useState('');
  const [error, setError] = useState('');

  const normalizedNickname = useMemo(
    () => nickname.trim().replace(/\s+/g, ' ').slice(0, 24),
    [nickname],
  );

  const resetGame = useCallback(() => {
    setBoard(generateBoard());
    setStrikes(new Set());
    setWinner('');
    setError('');
  }, []);

  useEffect(() => {
    const onStartGame = ({ players: nextPlayers, turn: nextTurn }: StartGamePayload) => {
      setPlayers(nextPlayers);
      setTurn(nextTurn);
      setBoard(generateBoard());
      setStrikes(new Set());
      setWinner('');
      setError('');
    };

    const onStrike = ({ number, nextTurn }: StrikePayload) => {
      setStrikes((current) => {
        const next = new Set(current);
        next.add(number);
        return next;
      });
      setTurn(nextTurn);
    };

    const onWin = ({ winner: nextWinner }: { winner: string }) => {
      setWinner(nextWinner);
    };

    const onPlayerLeft = () => {
      setError('The other player left the room.');
      setInRoom(false);
    };

    socket.on('startGame', onStartGame);
    socket.on('strike', onStrike);
    socket.on('win', onWin);
    socket.on('playerLeft', onPlayerLeft);

    return () => {
      socket.off('startGame', onStartGame);
      socket.off('strike', onStrike);
      socket.off('win', onWin);
      socket.off('playerLeft', onPlayerLeft);
    };
  }, []);

  useEffect(() => {
    if (!inRoom || !roomCode || board.length !== 5) return;
    socket.emit('sendBoard', { roomCode, board });
  }, [board, inRoom, roomCode]);

  const handleCreate = () => {
    if (!normalizedNickname) {
      setError('Enter a nickname first.');
      return;
    }

    setError('');
    socket.emit('createRoom', { nickname: normalizedNickname }, (response: ServerError & { roomCode?: string }) => {
      if (response.error || !response.roomCode) {
        setError(response.error ?? 'Unable to create room.');
        return;
      }

      setRoomCode(response.roomCode);
      setInRoom(true);
      setPlayers([normalizedNickname]);
      resetGame();
    });
  };

  const handleJoin = () => {
    const normalizedRoomCode = roomCode.trim().toUpperCase();

    if (!normalizedNickname || normalizedRoomCode.length !== 6) {
      setError('Enter a nickname and a valid 6-character room code.');
      return;
    }

    setError('');
    socket.emit(
      'joinRoom',
      { roomCode: normalizedRoomCode, nickname: normalizedNickname },
      (response: ServerError) => {
        if (response.error) {
          setError(response.error);
          return;
        }

        setRoomCode(normalizedRoomCode);
        setInRoom(true);
        resetGame();
      },
    );
  };

  const handleStrike = (number: number) => {
    if (turn !== normalizedNickname || strikes.has(number) || winner) return;

    socket.emit('strike', { roomCode, number });
  };

  const handleRestart = () => {
    if (!roomCode) return;
    socket.emit('restartGame', { roomCode }, (response: ServerError) => {
      if (response.error) setError(response.error);
    });
  };

  if (!inRoom) {
    return (
      <main className="app-shell">
        <section className="card lobby">
          <p className="eyebrow">STRIKEZONE</p>
          <h1>Real-time number strategy</h1>
          <p className="muted">Create a room or join a friend with a six-character code.</p>

          <label>
            Nickname
            <input
              value={nickname}
              maxLength={24}
              autoComplete="nickname"
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Your nickname"
            />
          </label>

          <button className="primary" onClick={handleCreate}>
            Create room
          </button>

          <div className="divider">or</div>

          <label>
            Room code
            <input
              value={roomCode}
              maxLength={6}
              autoCapitalize="characters"
              onChange={(event) => setRoomCode(event.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase())}
              placeholder="ABC123"
            />
          </label>

          <button className="secondary" onClick={handleJoin}>
            Join room
          </button>

          {error && <p className="error" role="alert">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="card game">
        <div className="game-header">
          <div>
            <p className="eyebrow">ROOM {roomCode}</p>
            <h1>StrikeZone</h1>
          </div>
          <span className={turn === normalizedNickname ? 'status your-turn' : 'status'}>
            {winner ? 'Game over' : turn === normalizedNickname ? 'Your turn' : 'Waiting'}
          </span>
        </div>

        <p className="players">{players.join(' vs ')}</p>

        {winner && <p className="winner" role="status">{winner} wins!</p>}

        <div className="board" aria-label="5 by 5 number board">
          {board.flat().map((number) => {
            const disabled = strikes.has(number) || turn !== normalizedNickname || Boolean(winner);
            return (
              <button
                key={number}
                className={strikes.has(number) ? 'cell struck' : 'cell'}
                onClick={() => handleStrike(number)}
                disabled={disabled}
                aria-label={`Strike number ${number}`}
              >
                {number}
              </button>
            );
          })}
        </div>

        <div className="actions">
          <button className="secondary" onClick={handleRestart}>Restart</button>
          <button className="ghost" onClick={() => setInRoom(false)}>Leave</button>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </main>
  );
};

export default App;
