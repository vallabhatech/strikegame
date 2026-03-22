import { Router } from 'express';
import GameController from '../controllers/gameController';

const router = Router();
const gameController = new GameController();

router.post('/create-room', gameController.createRoom.bind(gameController));
router.post('/join-room', gameController.joinRoom.bind(gameController));
router.get('/rooms', gameController.getRooms.bind(gameController));

export default router;