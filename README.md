# StrikeZone

StrikeZone is a real-time two-player number strategy game. Each player receives a shuffled 5×5 board containing numbers 1–25 and takes turns striking numbers. Complete a row, column, or diagonal of struck numbers to win.

<img width="1408" height="768" alt="Gemini_Generated_Image_vci93bvci93bvci9" src="https://github.com/user-attachments/assets/8f7d4755-ea9e-4ae5-9bdf-6eae14ae0f98" />


## Stack

- **Frontend:** React 18 + TypeScript + Create React App
- **Realtime transport:** Socket.IO client/server
- **Backend:** Node.js + Express
- **State:** In-memory room state
- **CI:** GitHub Actions
- **Security scanning:** CodeQL

## Repository layout

```text
strikegame/
├── client/
│   ├── public/
│   ├── src/
│   │   └── App.tsx
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── codeql.yml
├── CHANGELOG_PROGRESS.md
├── package.json
└── README.md
```

## How the game works

1. Player 1 creates a room and receives a six-character room code.
2. Player 2 joins using that code.
3. Both players submit their generated 5×5 boards.
4. The server controls whose turn it is.
5. A valid strike is broadcast to both players.
6. The server tracks struck numbers and checks both boards for a completed line.
7. A player can restart a two-player room without creating a new room.

The server is authoritative for turn order, valid numbers, room membership, and win detection. This prevents the client from deciding game outcomes by itself.

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- Git

## Local development

### 1. Install the frontend

Windows PowerShell:

```powershell
cd client
npm install
```

macOS/Linux:

```bash
cd client
npm install
```

### 2. Configure the frontend

Copy `client/.env.example` to `client/.env.local` and set:

```env
REACT_APP_SOCKET_URL=http://localhost:4000
```

The client also falls back to port 4000 on the current hostname when the variable is not supplied.

### 3. Install the server

```bash
cd ../server
npm install
```

Optional production-style configuration:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

### 4. Start the server

```bash
cd server
npm start
```

The server exposes:

- `GET /health` — service health check
- Socket.IO — real-time game transport

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm start
```

Open http://localhost:3000.

## Production build

Build the frontend:

```bash
cd client
npm run typecheck
npm run build
```

Start the backend:

```bash
cd server
npm start
```

For production, deploy the React build to a static hosting service and run the Node.js server on a platform that supports long-lived WebSocket connections. Set `REACT_APP_SOCKET_URL` to the public server URL and set `CLIENT_ORIGIN` on the server to the exact frontend origin.

## Environment variables

### Client

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_SOCKET_URL` | No | Public Socket.IO server URL. Defaults to the current hostname on port 4000. |

### Server

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP/WebSocket port. Defaults to 4000. |
| `CLIENT_ORIGIN` | Recommended | Allowed browser origin for Socket.IO CORS. |

Never commit real secrets or private deployment configuration.

## Socket events

### Client → server

| Event | Purpose |
|---|---|
| `createRoom` | Create a two-player room |
| `joinRoom` | Join a room |
| `sendBoard` | Submit a player's board |
| `strike` | Request a number strike |
| `restartGame` | Reset a two-player room |

### Server → client

| Event | Purpose |
|---|---|
| `startGame` | Sends player names and current turn |
| `boardsReady` | Both boards are available |
| `strike` | Broadcasts a valid strike and next turn |
| `win` | Announces the server-validated winner |
| `playerLeft` | Notifies the remaining player |

## Reliability and security improvements

The server now:

- Validates nicknames and room codes.
- Limits nicknames to 24 characters.
- Validates board shape and number range.
- Uses cryptographically generated room codes instead of `Math.random()`.
- Rejects strikes from players who are not currently taking a turn.
- Rejects duplicate or out-of-range strikes.
- Calculates winning lines on the server.
- Restricts JSON request size.
- Removes Express's `X-Powered-By` header.
- Provides a health endpoint for deployment monitoring.
- Supports an explicit frontend origin through `CLIENT_ORIGIN`.

The client now:

- Uses a configurable Socket.IO endpoint.
- Cleans up Socket.IO listeners correctly.
- Uses strict TypeScript settings.
- Uses a proper Fisher–Yates shuffle.
- Validates lobby input before sending requests.
- Avoids optimistic local strike state; the server confirms valid strikes.
- Provides accessible labels and status messaging.

## CI/CD

Every push and pull request triggers GitHub Actions.

### CI

The CI workflow:

1. Installs the client.
2. Runs TypeScript typechecking.
3. Builds the production client.
4. Installs the server.
5. Checks server JavaScript syntax.
6. Runs a high-severity npm dependency audit.
7. Runs the repository smoke test.

### CodeQL

CodeQL scans JavaScript and TypeScript on pushes and pull requests and runs a weekly scheduled scan. GitHub documents push/PR and scheduled CodeQL scanning as the standard way to continuously detect vulnerabilities and code-quality issues. 

## Testing

Frontend typecheck:

```bash
cd client
npm run typecheck
```

Frontend production build:

```bash
cd client
npm run build
```

Server syntax:

```bash
cd server
node --check index.js
```

Root smoke test:

```bash
npm test
```

## Current architecture limitations

Game state is stored in process memory. Restarting the server clears active rooms, and multiple server instances cannot share rooms without a shared state layer.

For a larger deployment, the next architectural step would be a shared state store such as Redis plus a Socket.IO adapter. Persistent player accounts and game history would require a database.

## Contributing

1. Create a feature branch.
2. Make one logical change at a time.
3. Run the relevant local checks.
4. Open a pull request.
5. Wait for CI and CodeQL checks before merging.

See `CHANGELOG_PROGRESS.md` for the repository maintenance history.

## License

ISC
