const Sequelize = require('sequelize');
const config    = require('../config/db.config');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host:    config.HOST,
  port:    config.port,
  dialect: config.dialect,
  pool:    config.pool,
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User        = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Structure   = require('./structure.model')(sequelize, Sequelize.DataTypes);
db.Hydrography = require('./hydrography.model')(sequelize, Sequelize.DataTypes);
db.Town        = require('./town.model')(sequelize, Sequelize.DataTypes);
db.Airport     = require('./airport.model')(sequelize, Sequelize.DataTypes);
db.Runway      = require('./runway.model')(sequelize, Sequelize.DataTypes);
db.RoadPath    = require('./road_path.model')(sequelize, Sequelize.DataTypes);

// Airport ↔ Runway association
db.Airport.hasMany(db.Runway, { foreignKey: 'airportId', as: 'runways' });
db.Runway.belongsTo(db.Airport, { foreignKey: 'airportId' });

module.exports = db;
