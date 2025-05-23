import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Gallery = sequelize.define('Gallery', {
  waktu_ditambah: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

export default Gallery;