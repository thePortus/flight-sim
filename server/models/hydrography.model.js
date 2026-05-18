module.exports = (sequelize, DataTypes) => {
  return sequelize.define('hydrography', {
    name:  { type: DataTypes.STRING(100), allowNull: false },
    type:  { type: DataTypes.ENUM('lake', 'river'), defaultValue: 'lake' },
    // World-space centre (Y is always ground level)
    x:     { type: DataTypes.FLOAT, allowNull: false },
    z:     { type: DataTypes.FLOAT, allowNull: false },
    // Footprint dimensions
    width: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 100 },
    depth: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 100 },
  }, { tableName: 'hydrography' });
};
