export type Player = {
    id: string;
    name: string;
    score: number;
};

export type Room = {
    id: string;
    players: Player[];
    currentPlayerIndex: number;
    gameState: GameState;
};

export type GameState = {
    board: number[][];
    strikes: boolean[][];
    isGameOver: boolean;
};