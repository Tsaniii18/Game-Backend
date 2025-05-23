import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getUserLibrary, removeFromLibrary } from '../controllers/galleryController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getUserLibrary);
router.delete('/:gameId', removeFromLibrary);

export default router;