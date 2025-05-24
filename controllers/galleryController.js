import { Gallery, Game } from '../models/index.js';

export const getUserLibrary = async (req, res) => {
  try {
    const library = await Gallery.findAll({
      where: { user_id: req.userId },
      include: [{
        model: Game,
        attributes: ['id', 'nama_game', 'gambar', 'tag', 'deskripsi']
      }],
      order: [['waktu_ditambah', 'DESC']]
    });

    res.json({
      success: true,
      data: library.map(item => ({
        id: item.id,
        waktu_ditambah: item.waktu_ditambah,
        game: item.Game
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch library',
      error: error.message
    });
  }
};

export const removeFromLibrary = async (req, res) => {
  try {
    const deletedCount = await Gallery.destroy({
      where: {
        user_id: req.userId,
        game_id: req.params.gameId
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Game not found in your library',
        error: 'GAME_NOT_IN_LIBRARY'
      });
    }

    res.json({
      success: true,
      message: 'Game removed from library'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove game from library',
      error: error.message
    });
  }
};