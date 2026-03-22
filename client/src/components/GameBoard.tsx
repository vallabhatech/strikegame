import React from 'react';
import { useGame } from '../hooks/useGame';

const GameBoard: React.FC = () => {
    const { board, currentPlayer, strikeNumber, handleStrike } = useGame();

    return (
        <div>
            <h1>StrikeZone</h1>
            <h2>Current Player: {currentPlayer}</h2>
            <div className="game-board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="game-row">
                        {row.map((number, colIndex) => (
                            <button
                                key={colIndex}
                                className="game-cell"
                                onClick={() => handleStrike(number)}
                                disabled={!number}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;