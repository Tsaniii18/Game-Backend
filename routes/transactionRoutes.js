import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { buyGame, getPurchaseHistory } from '../controllers/transactionController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', buyGame);
router.get('/history', getPurchaseHistory);

export default router;