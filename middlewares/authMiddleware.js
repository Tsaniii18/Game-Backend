import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/index.js';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers['x-access-token'];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.userId = decoded.userId;
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};