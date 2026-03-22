import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';

const socket = io('http://localhost:4000');

function generateBoard() {
  const nums = Array.from({ length: 25 }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);
  return Array.from({ length: 5 }, (_, i) => nums.slice(i * 5, i * 5 + 5));
}

function checkWin(board, strikes) {
  // Check rows, cols, diags for all struck
  for (let i = 0; i < 5; i++) {
    if (board[i].every(n => strikes.has(n))) return true;
    if (board.map(row => row[i]).every(n => strikes.has(n))) return true;
  }
  if ([0,1,2,3,4].every(i => strikes.has(board[i][i]))) return true;
  if ([0,1,2,3,4].every(i => strikes.has(board[i][4-i]))) return true;
  return false;
}

const App: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [board, setBoard] = useState([]);
  const [strikes, setStrikes] = useState(new Set());
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState('');
  const [winner, setWinner] = useState('');
  const [error, setError] = useState('');

  // Socket events
  useEffect(() => {
    socket.on('startGame', ({ players, turn }) => {
      setPlayers(players);
      setTurn(turn);
      setWinner('');
    });
    socket.on('boardsReady', () => {});
    socket.on('strike', ({ number, nextTurn }) => {
      setStrikes(s => new Set([...s, number]));
      setTurn(nextTurn);
    });
    socket.on('win', ({ winner }) => setWinner(winner));
    socket.on('playerLeft', () => setError('Other player left.'));
    return () => socket.off();
  }, []);

  // Send board to server after joining
  useEffect(() => {
    if (inRoom && board.length) {
      socket.emit('sendBoard', { roomCode, board });
    }
  }, [inRoom, board, roomCode]);

  function handleCreate() {
    if (!nickname) return;
    socket.emit('createRoom', { nickname }, ({ roomCode }) => {
      setRoomCode(roomCode);
      setInRoom(true);
      setBoard(generateBoard());
      setStrikes(new Set());
    });
  }

  function handleJoin() {
    if (!nickname || !roomCode) return;
    socket.emit('joinRoom', { roomCode, nickname }, ({ error }) => {
      if (error) setError(error);
      else {
        setInRoom(true);
        setBoard(generateBoard());
        setStrikes(new Set());
      }
    });
  }

  function handleStrike(num) {
    if (turn !== nickname || strikes.has(num) || winner) return;
    socket.emit('strike', { roomCode, number: num });
    setStrikes(s => new Set([...s, num]));
    if (checkWin(board, new Set([...strikes, num]))) {
      socket.emit('win', { roomCode, winner: nickname });
    }
  }

  function handleRestart() {
    setBoard(generateBoard());
    setStrikes(new Set());
    setWinner('');
    socket.emit('sendBoard', { roomCode, board });
  }

  if (!inRoom) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">StrikeZone</h1>
        <input className="border p-2 mb-2 w-full" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} />
        <div className="flex gap-2 mb-2">
          <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>Create Room</button>
          <input className="border p-2 flex-1" placeholder="Room Code" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} />
          <button className="bg-green-500 text-white px-4 py-2" onClick={handleJoin}>Join</button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl mb-2">Room: <b>{roomCode}</b></h2>
      <div className="mb-2">Players: {players.join(' vs ')}</div>
      <div className="mb-2">Turn: <b>{turn}</b></div>
      {winner && <div className="text-green-600 font-bold mb-2">{winner} wins!</div>}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {board.flat().map(num => (
          <button
            key={num}
            className={`w-12 h-12 border rounded ${strikes.has(num) ? 'bg-gray-400' : 'bg-white'} ${turn === nickname && !strikes.has(num) && !winner ? 'hover:bg-blue-200' : ''}`}
            onClick={() => handleStrike(num)}
            disabled={strikes.has(num) || turn !== nickname || winner}
          >
            {num}
          </button>
        ))}
      </div>
      <button className="bg-yellow-500 text-white px-4 py-2" onClick={handleRestart}>Restart</button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

const MainApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/game" component={GameBoard} />
      </Switch>
    </Router>
  );
};

export default MainApp;