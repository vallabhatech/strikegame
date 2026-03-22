import { useEffect, useState } from 'react';
import { Player, GameState } from '../types';

const useGame = () => {
    const [board, setBoard] = useState<number[][]>(Array(5).fill(Array(5).fill(0)));
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        // Initialize game state and players
        const initialPlayer: Player = { id: 'player1', name: 'Player 1' };
        setCurrentPlayer(initialPlayer);
        setGameState({ players: [initialPlayer], currentTurn: initialPlayer.id });
    }, []);

    const strikeNumber = (row: number, col: number) => {
        if (board[row][col] !== 0) {
            const newBoard = [...board];
            newBoard[row][col] = 0; // Strike the number
            setBoard(newBoard);
            switchPlayer();
        }
    };

    const switchPlayer = () => {
        if (gameState) {
            const nextPlayer = gameState.players.find(player => player.id !== currentPlayer?.id);
            setCurrentPlayer(nextPlayer || null);
            setGameState({ ...gameState, currentTurn: nextPlayer?.id });
        }
    };

    return { board, currentPlayer, strikeNumber };
};

export default useGame;