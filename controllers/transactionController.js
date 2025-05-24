import { Transaction, Game, User, Gallery } from '../models/index.js';

export const buyGame = async (req, res) => {
  const { id_game, metode_pembayaran } = req.body;
  
  try {
    // Validasi: Cek apakah game ada
    const game = await Game.findByPk(id_game);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
        error: 'GAME_NOT_FOUND'
      });
    }

    // Validasi: User tidak boleh membeli game sendiri
    if (game.uploader_id === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot buy your own game',
        error: 'CANNOT_BUY_OWN_GAME'
      });
    }

    // Validasi: Cek apakah game sudah dimiliki
    const existingPurchase = await Gallery.findOne({
      where: {
        user_id: req.userId,
        game_id: id_game
      }
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You already own this game',
        error: 'GAME_ALREADY_OWNED'
      });
    }

    // Hitung harga setelah diskon
    const harga_discount = game.harga - (game.harga * game.discount / 100);

    // Buat transaksi
    const transaction = await Transaction.create({
      id_game,
      id_pembeli: req.userId,
      metode_pembayaran,
      harga_awal: game.harga,
      discount: game.discount,
      harga_discount
    });

    // Tambahkan ke library user
    await Gallery.create({
      user_id: req.userId,
      game_id: id_game
    });

    // Respons sukses
    res.status(201).json({
      success: true,
      message: 'Game purchased successfully',
      data: {
        transaction,
        game: {
          id: game.id,
          nama_game: game.nama_game,
          harga_awal: game.harga,
          discount: game.discount,
          harga_discount
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process purchase',
      error: error.message
    });
  }
};

export const getPurchaseHistory = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { id_pembeli: req.userId },
      include: [{
        model: Game,
        attributes: ['id', 'nama_game', 'gambar']
      }],
      order: [['tanggal_pembelian', 'DESC']]
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase history',
      error: error.message
    });
  }
};