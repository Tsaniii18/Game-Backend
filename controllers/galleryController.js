import { Gallery, Game } from '../models/index.js';

export const getUserLibrary = async (req, res) => {
  try {
    const library = await Gallery.findAll({
      where: { user_id: req.userId },
      include: [Game]
    });
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromLibrary = async (req, res) => {
  try {
    const galleryItem = await Gallery.findOne({
      where: {
        user_id: req.userId,
        game_id: req.params.gameId
      }
    });
    
    if (!galleryItem) return res.status(404).json({ message: 'Game not found in library' });

    await galleryItem.destroy();
    res.json({ message: 'Game removed from library' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};