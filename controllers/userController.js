import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: { exclude: ['password', 'refresh_token'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { username, password, foto_profil } = req.body;
  
  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (foto_profil) updateData.foto_profil = foto_profil;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await User.update(updateData, { where: { id: req.userId } });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};