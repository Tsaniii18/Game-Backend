export const getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
        error: 'GAME_NOT_FOUND'
      });
    }

    // Cek apakah user sudah memiliki game ini (jika sudah login)
    let owned = false;
    if (req.userId) {
      const galleryItem = await Gallery.findOne({
        where: {
          user_id: req.userId,
          game_id: game.id
        }
      });
      owned = !!galleryItem;
    }

    res.json({
      success: true,
      data: {
        ...game.toJSON(),
        owned
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game details',
      error: error.message
    });
  }
};