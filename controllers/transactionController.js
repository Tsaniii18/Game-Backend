import { Transaction, Game, User } from '../models/index.js';

export const buyGame = async (req, res) => {
  const { id_game, metode_pembayaran } = req.body;
  
  try {
    const game = await Game.findByPk(id_game);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const harga_discount = game.harga - (game.harga * game.discount / 100);

    const transaction = await Transaction.create({
      id_game,
      id_pembeli: req.userId,
      metode_pembayaran,
      harga_awal: game.harga,
      discount: game.discount,
      harga_discount
    });

    // Add to user's gallery
    await Gallery.create({
      user_id: req.userId,
      game_id: id_game
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchaseHistory = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { id_pembeli: req.userId },
      include: [Game]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};