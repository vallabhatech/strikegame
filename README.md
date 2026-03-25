# StrikeZone Game

![Project Logo](https://via.placeholder.com/150?text=StrikeZone)

## Short Description

StrikeZone is a 2-player real-time number strike game built with React for the frontend and Node.js for the backend. Players take turns striking numbers on a 5x5 grid, aiming to outscore each other by completing rows, columns, or diagonals.

## Features

- **Real-time Multiplayer**: Play with another player in real-time using WebSocket connections
- **Room-based Gameplay**: Create and join game rooms with unique room codes
- **5x5 Number Grid**: Each player gets a randomly generated 5x5 grid with numbers 1-25
- **Turn-based Gameplay**: Players alternate turns striking numbers from their grid
- **Win Detection**: Automatic detection of winning conditions (rows, columns, diagonals)
- **Player Nicknames**: Customizable player nicknames for personalization
- **Game Restart**: Ability to restart the game without leaving the room
- **Disconnect Handling**: Automatic room cleanup when a player disconnects
- **Responsive UI**: Clean and simple user interface with visual feedback

## Tech Stack

### Frontend
- **React 17.0.2** - UI library
- **React DOM 17.0.2** - React DOM renderer
- **TypeScript 4.1.2** - Type-safe JavaScript
- **Socket.io Client 4.0.0** - WebSocket client for real-time communication
- **React Scripts 4.0.3** - Build and development tooling

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **Socket.io 4.8.1** - WebSocket server for real-time communication
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **TypeScript** - Type-safe backend development

### Database
- Not found in the current codebase (in-memory storage used)

### AI/ML
- Not found in the current codebase

### Authentication
- Not found in the current codebase (no authentication system implemented)

### Cloud
- Not found in the current codebase

### DevOps
- Not found in the current codebase

### Libraries
- **react-router-dom** - Client-side routing (imported but not fully utilized)

### APIs
- **Socket.io API** - Real-time bidirectional event-based communication
- **REST API** - Express routes for game management (partially implemented)

### Deployment
- Not found in the current codebase

## Architecture

StrikeZone follows a client-server architecture with real-time communication:

1. **Server (Node.js + Express + Socket.io)**
   - Runs on port 4000 (main server) or 5000 (TypeScript server)
   - Manages game rooms and player connections in memory
   - Handles WebSocket events for real-time gameplay
   - Uses Socket.io for bidirectional communication
   - Two server implementations:
     - `server/index.js` - Main production server with full game logic
     - `server/src/index.ts` - TypeScript server with REST API structure

2. **Client (React + TypeScript)**
   - Connects to server via Socket.io client
   - Manages local game state and UI rendering
   - Handles user interactions and emits socket events
   - Implements win detection logic client-side
   - Uses React hooks for state management

3. **Game Flow**
   - Player 1 creates a room and receives a 6-character room code
   - Player 2 joins using the room code
   - Both players generate their own 5x5 number boards
   - Game starts when both players are ready
   - Players alternate turns striking numbers
   - First player to complete a row, column, or diagonal wins
   - Game can be restarted without leaving the room

4. **Data Flow**
   - Room state stored in memory on server
   - Board states stored per player in room
   - Socket events: `createRoom`, `joinRoom`, `sendBoard`, `strike`, `win`, `disconnecting`
   - Client events: `startGame`, `boardsReady`, `strike`, `win`, `playerLeft`

## Folder Structure

```
strikegame/
├── client/                          # React frontend application
│   ├── public/
│   │   └── index.html              # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   └── GameBoard.tsx       # Game board component (alternate implementation)
│   │   ├── hooks/
│   │   │   └── useGame.ts          # Custom game logic hook
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript type definitions
│   │   ├── App.tsx                 # Main application component
│   │   └── index.tsx               # React entry point
│   ├── package.json                # Frontend dependencies
│   └── tsconfig.json               # TypeScript configuration
├── server/                          # Node.js backend application
│   ├── src/
│   │   ├── controllers/
│   │   │   └── gameController.ts   # Game logic controller (REST API)
│   │   ├── routes/
│   │   │   └── gameRoutes.ts       # Express route definitions
│   │   ├── types/
│   │   │   └── index.ts            # Server TypeScript types
│   │   └── index.ts                # TypeScript server entry point
│   ├── index.js                    # Main JavaScript server (production)
│   ├── package.json                # Backend dependencies
│   └── tsconfig.json               # TypeScript configuration
├── package.json                     # Root package.json
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

### Major Folders Explained

- **client/**: Contains the React frontend application with TypeScript
- **client/src/components/**: Reusable React components for the UI
- **client/src/hooks/**: Custom React hooks for game logic
- **client/src/types/**: Shared TypeScript type definitions
- **server/**: Contains the Node.js backend server
- **server/src/controllers/**: Business logic for game management
- **server/src/routes/**: Express route handlers for REST API
- **server/src/types/**: Server-side TypeScript type definitions

## Prerequisites

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn v1.22.0 or higher)
- **Git**: For cloning the repository

## Installation

### Clone Repository

```bash
# Windows (PowerShell)
git clone https://github.com/yourusername/strikegame.git
cd strikegame

# macOS/Linux
git clone https://github.com/yourusername/strikegame.git
cd strikegame
```

### Install Dependencies

```bash
# Windows (PowerShell)
npm install
cd client
npm install
cd ../server
npm install
cd ..

# macOS/Linux
npm install
cd client && npm install && cd ../server && npm install && cd ..
```

### Configure Environment Variables

Not found in the current codebase (no environment variables required)

### Database Setup

Not found in the current codebase (uses in-memory storage)

### Migrations

Not found in the current codebase

### Seed Data

Not found in the current codebase

### Running Locally

#### Start the Server

```bash
# Windows (PowerShell)
cd server
node index.js

# macOS/Linux
cd server
node index.js
```

The server will start on port 4000.

#### Start the Client

```bash
# Windows (PowerShell)
cd client
npm start

# macOS/Linux
cd client
npm start
```

The client will open in your browser at http://localhost:3000.

## Environment Variables

Not found in the current codebase (no environment variables required)

## Running the Project

### Development Mode

**Server:**
```bash
cd server
node index.js
```

**Client:**
```bash
cd client
npm start
```

### Production Mode

Not found in the current codebase

### Docker

Not found in the current codebase

## API Documentation

### Socket.io Events

| Event | Direction | Purpose | Data |
|-------|-----------|---------|------|
| `createRoom` | Client → Server | Create a new game room | `{ nickname: string }` |
| `joinRoom` | Client → Server | Join an existing room | `{ roomCode: string, nickname: string }` |
| `sendBoard` | Client → Server | Send player's board state | `{ roomCode: string, board: number[][] }` |
| `strike` | Client → Server | Strike a number on the board | `{ roomCode: string, number: number }` |
| `win` | Client → Server | Announce winner | `{ roomCode: string, winner: string }` |
| `startGame` | Server → Client | Game starts with players | `{ players: string[], turn: string }` |
| `boardsReady` | Server → Client | Both boards are ready | `{}` |
| `strike` | Server → Client | Number struck notification | `{ number: number, nextTurn: string }` |
| `win` | Server → Client | Winner announcement | `{ winner: string }` |
| `playerLeft` | Server → Client | Player disconnected notification | `{}` |

### REST API Endpoints (TypeScript Server)

| Method | Route | Purpose | Authentication | Request Body | Response |
|--------|-------|---------|----------------|--------------|----------|
| POST | `/api/create-room` | Create a new room | None | `{ roomId: string }` | `{ success: boolean, roomId?: string, message?: string }` |
| POST | `/api/join-room` | Join an existing room | None | `{ roomId: string, player: object }` | `{ success: boolean, players?: array, message?: string }` |
| GET | `/api/rooms` | Get all rooms | None | None | Not found in current codebase |

## Database

Not found in the current codebase (uses in-memory storage)

### Data Models

**Room (In-Memory)**
```javascript
{
  players: [{ id: string, nickname: string }],
  boardStates: { [socketId: string]: number[][] },
  turn: number,
  started: boolean
}
```

**Player**
```typescript
{
  id: string;
  name: string;
  score: number;
}
```

**GameState**
```typescript
{
  board: number[][];
  strikes: boolean[][];
  isGameOver: boolean;
}
```

## Authentication

Not found in the current codebase (no authentication system implemented)

## Configuration

### TypeScript Configuration

**Client (client/tsconfig.json)**
- Target: ES5
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled

**Server (server/tsconfig.json)**
- Target: ES6
- Module: CommonJS
- Output directory: ./dist
- Strict mode enabled

### Git Ignore

The `.gitignore` file excludes:
- Node modules and dependency files
- Environment files (.env, .env.local)
- IDE configuration (.vscode, .idea)
- Log files
- Build outputs (/dist, /build, /out)
- OS files (.DS_Store, Thumbs.db)

## Build Instructions

### Build Client

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` directory.

### Build Server

```bash
cd server
npx tsc
```

This compiles TypeScript files to the `server/dist` directory.

## Deployment

Not found in the current codebase

## Testing

### Run Tests

```bash
# Client tests
cd client
npm test

# Server tests
Not found in the current codebase
```

Note: The test script in package.json currently returns an error indicating no tests are specified.

## Scripts

### Root package.json

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `echo "Error: no test specified" && exit 1` | Placeholder for tests |

### Client package.json

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `react-scripts start` | Start React development server |
| `build` | `react-scripts build` | Build React app for production |
| `test` | `react-scripts test` | Run React tests |
| `eject` | `react-scripts eject` | Eject from Create React App |

### Server package.json

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `react-scripts start` | Start React development server (appears to be incorrect) |

## Usage Examples

### Creating a Room

1. Open the application in your browser
2. Enter your nickname
3. Click "Create Room"
4. Share the generated 6-character room code with another player

### Joining a Room

1. Open the application in your browser
2. Enter your nickname
3. Enter the room code provided by the host
4. Click "Join"

### Playing the Game

1. Wait for both players to join
2. The game starts automatically
3. When it's your turn, click a number on your 5x5 grid to strike it
4. The turn passes to the other player
5. First player to complete a row, column, or diagonal wins
6. Click "Restart" to play again without leaving the room

## Screenshots

![Landing Page](https://via.placeholder.com/800x600?text=Landing+Page+-+Enter+Nickname+and+Create/Join+Room)

![Game Board](https://via.placeholder.com/800x600?text=Game+Board+-+5x5+Grid+with+Numbers)

![Win Screen](https://via.placeholder.com/800x600?text=Win+Screen+-+Winner+Announcement)

## Error Handling

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| **Room not found or full** | Verify the room code is correct and ensure the room hasn't reached 2 players |
| **Other player left** | The game ends when a player disconnects. Create a new room to play again |
| **Cannot strike number** | Ensure it's your turn and the number hasn't already been struck |
| **Server not connecting** | Ensure the server is running on port 4000 and check CORS settings |
| **Client not starting** | Ensure all dependencies are installed and port 3000 is available |

## Performance Notes

- The server uses in-memory storage, which is fast but not persistent
- Socket.io provides efficient real-time communication with minimal latency
- The client-side win detection is optimized for 5x5 grids
- No database queries are made, resulting in fast gameplay

## Security Notes

- CORS is enabled for all origins (`*`) - should be restricted in production
- No authentication is implemented - anyone can join any room
- No input validation on nicknames or room codes
- Room codes are generated using `Math.random()` which is not cryptographically secure
- No rate limiting on socket events
- Consider implementing these security measures for production deployment

## Limitations

- Maximum 2 players per room
- No persistent storage - game data is lost on server restart
- No authentication system
- No player statistics or history
- Fixed 5x5 grid size
- No custom game modes or settings
- No spectator mode
- No chat functionality
- Room codes are only 6 characters (collision possible)
- No password protection for rooms

## Future Improvements

- Add persistent database storage (MongoDB, PostgreSQL, etc.)
- Implement user authentication and accounts
- Add player statistics and game history
- Support for more than 2 players
- Customizable grid sizes and game modes
- Chat functionality between players
- Password-protected rooms
- Spectator mode
- Leaderboards and rankings
- Mobile app version
- Sound effects and animations
- Undo functionality
- Game replay feature
- Tournament mode

## Contributing Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow the existing code style and include tests for new features.

## Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Indentation**: 2 spaces (TypeScript default)
- **Semicolons**: Required
- **Quotes**: Single quotes preferred

## License

ISC License

## Authors

Not found in the current codebase

## Acknowledgements

- React team for the amazing UI library
- Socket.io team for real-time communication
- Create React App for the project scaffolding

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Initial release | Basic 2-player game functionality |

## FAQ

**Q: How many players can join a room?**
A: Currently, rooms support a maximum of 2 players.

**Q: What happens if a player disconnects?**
A: The room is automatically deleted and the other player is notified.

**Q: Can I play against myself?**
A: No, you need two separate browser windows or devices to play.

**Q: Is my game progress saved?**
A: No, game data is stored in memory and lost when the server restarts.

**Q: Can I customize the grid size?**
A: Not currently. The grid is fixed at 5x5.

**Q: How are room codes generated?**
A: Room codes are randomly generated 6-character alphanumeric strings.

## Contact

Not found in the current codebase
