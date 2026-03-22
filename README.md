# StrikeZone Game

## Overview
StrikeZone is a 2-player real-time number strike game built with React for the frontend and Node.js for the backend. Players take turns striking numbers on a 5x5 grid, aiming to outscore each other.

## Features
- Real-time multiplayer gameplay using Socket.io
- 5x5 number grid for players to strike
- Turn-based mechanics to ensure fair play
- Simple and intuitive user interface

## Project Structure
```
strikezone-game
├── client                # Frontend React application
│   ├── public
│   ├── src
│   ├── package.json
│   └── tsconfig.json
├── server                # Backend Node.js application
│   ├── src
│   ├── package.json
│   └── tsconfig.json
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd strikezone-game
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd ../server
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to play the game.

## Usage
- Players can create or join a game room.
- Each player takes turns striking numbers on the grid.
- The game ends when all numbers are struck, and the player with the highest score wins.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.