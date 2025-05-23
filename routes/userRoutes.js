import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.delete('/me', deleteProfile);

export default router;