import bcrypt from 'bcrypt';
import { User, Game, Transaction, Gallery } from '../models/index.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password', 'refresh_token'] },
      include: [
        {
          model: Game,
          as: 'UploadedGames',
          attributes: ['id', 'nama_game', 'gambar', 'harga'],
          limit: 5,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Gallery,
          attributes: ['id'],
          include: [{
            model: Game,
            attributes: ['id']
          }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Hitung statistik
    const gameCount = await Game.count({ where: { uploader_id: req.userId } });
    const purchaseCount = await Gallery.count({ where: { user_id: req.userId } });
    const salesCount = await Transaction.count({
      include: [{
        model: Game,
        where: { uploader_id: req.userId }
      }]
    });

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        stats: {
          uploaded_games: gameCount,
          purchased_games: purchaseCount,
          total_sales: salesCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  const { username, oldPassword, newPassword, foto_profil } = req.body;
  
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const updateData = {};
    
    // Update username jika ada
    if (username) {
      updateData.username = username;
    }

    // Update foto profil jika ada
    if (foto_profil) {
      updateData.foto_profil = foto_profil;
    }

    // Update password jika ada
    if (oldPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
          error: 'INVALID_PASSWORD'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters',
          error: 'PASSWORD_TOO_SHORT'
        });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await user.update(updateData);

    // Exclude sensitive data from response
    const { password, refresh_token, ...safeUserData } = user.toJSON();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: safeUserData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Hapus semua game yang diunggah user
    await Game.destroy({ where: { uploader_id: req.userId } });

    // Hapus gallery items user
    await Gallery.destroy({ where: { user_id: req.userId } });

    // Hapus user
    await user.destroy();

    // Clear cookies jika menggunakan cookie-based auth
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({
      success: true,
      message: 'User account and all related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account',
      error: error.message
    });
  }
};