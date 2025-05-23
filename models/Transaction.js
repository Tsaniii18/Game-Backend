import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Transaction = sequelize.define('Transaction', {
  metode_pembayaran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_pembelian: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  harga_awal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  harga_discount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'transactions'
});

export default Transaction;