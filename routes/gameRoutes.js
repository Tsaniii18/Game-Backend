import express from 'express';
import { 
  getAllGames, 
  getGameById, 
  createGame, 
  updateGame, 
  updateDiscount, 
  deleteGame,
  getSalesHistory
} from '../controllers/gameController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllGames);
router.get('/:id', getGameById);

// Protected routes
router.use(verifyToken);

router.post('/', createGame);
router.patch('/:id', updateGame);
router.patch('/:id/discount', updateDiscount);
router.delete('/:id', deleteGame);
router.get('/sales', getSalesHistory);

export default router;