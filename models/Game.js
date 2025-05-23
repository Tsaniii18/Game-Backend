import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Game = sequelize.define('Game', {
  nama_game: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

export default Game;