import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import gameRoutes from './routes/gameRoutes';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use('/api', gameRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle game events here

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});