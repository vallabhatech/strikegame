export type Player = {
    id: string;
    name: string;
    score: number;
};

export type GameState = {
    board: number[][];
    currentPlayer: Player;
    winner: Player | null;
};

export type Room = {
    id: string;
    players: Player[];
    gameState: GameState;
};