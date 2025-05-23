import sequelize from '../config/db.js';
import User from './User.js';
import Game from './Game.js';
import Transaction from './Transaction.js';
import Gallery from './Gallery.js';

// Define relationships
User.hasMany(Game, { foreignKey: 'uploader_id' });
Game.belongsTo(User, { foreignKey: 'uploader_id' });

User.hasMany(Transaction, { foreignKey: 'id_pembeli' });
Transaction.belongsTo(User, { foreignKey: 'id_pembeli' });

Game.hasMany(Transaction, { foreignKey: 'id_game' });
Transaction.belongsTo(Game, { foreignKey: 'id_game' });

User.hasMany(Gallery, { foreignKey: 'user_id' });
Gallery.belongsTo(User, { foreignKey: 'user_id' });

Game.hasMany(Gallery, { foreignKey: 'game_id' });
Gallery.belongsTo(Game, { foreignKey: 'game_id' });

export { sequelize, User, Game, Transaction, Gallery };