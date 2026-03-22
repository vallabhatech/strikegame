class GameController {
    private rooms: { [key: string]: any } = {};

    createRoom(roomId: string) {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = {
                players: [],
                gameState: this.initializeGameState(),
            };
            return { success: true, roomId };
        }
        return { success: false, message: 'Room already exists' };
    }

    joinRoom(roomId: string, player: any) {
        const room = this.rooms[roomId];
        if (room && room.players.length < 2) {
            room.players.push(player);
            return { success: true, players: room.players };
        }
        return { success: false, message: 'Room is full or does not exist' };
    }

    strikeNumber(roomId: string, playerId: string, number: number) {
        const room = this.rooms[roomId];
        if (room) {
            const playerIndex = room.players.findIndex((p: any) => p.id === playerId);
            if (playerIndex !== -1) {
                // Logic to strike the number and update game state
                // For example, check if the number is valid and update the game state accordingly
                return { success: true, gameState: room.gameState };
            }
        }
        return { success: false, message: 'Invalid room or player' };
    }

    private initializeGameState() {
        // Initialize the game state, e.g., create a 5x5 grid of numbers
        return {
            grid: this.createNumberGrid(),
            currentPlayer: null,
        };
    }

    private createNumberGrid() {
        const grid = [];
        for (let i = 1; i <= 25; i++) {
            grid.push(i);
        }
        return grid;
    }
}

export default GameController;