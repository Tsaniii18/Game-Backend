import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto_profil: {
    type: DataTypes.STRING,
    defaultValue: 'default.jpg'
  },
  refresh_token: {
    type: DataTypes.STRING
  }
});

export default User;