import { Game, User, Transaction } from '../models/index.js';

export const getAllGames = async (req, res) => {
  const { search } = req.query;
  
  try {
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { nama_game: { [Op.like]: `%${search}%` } },
          { tag: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const games = await Game.findAll({ where: whereClause });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGame = async (req, res) => {
  const { nama_game, gambar, harga, tag, deskripsi } = req.body;
  
  try {
    const game = await Game.create({
      nama_game,
      uploader_id: req.userId,
      gambar,
      harga,
      tag,
      deskripsi
    });
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.uploader_id !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    await game.update(req.body);
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiscount = async (req, res) => {
  const { discount } = req.body;
  
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.uploader_id !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    await game.update({ discount });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.uploader_id !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    await game.destroy();
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Transaction.findAll({
      include: [{
        model: Game,
        where: { uploader_id: req.userId }
      }]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};