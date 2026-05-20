module.exports = (sequelize, DataTypes) => {
  return sequelize.define('hydrography', {
    name:  { type: DataTypes.STRING(100), allowNull: false },
    type:  { type: DataTypes.ENUM('lake', 'river', 'ocean'), defaultValue: 'lake' },
    x:     { type: DataTypes.FLOAT, allowNull: false },
    z:     { type: DataTypes.FLOAT, allowNull: false },
    width: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 100 },
    depth: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 100 },
    // Polygon vertices for lakes: [{dx, dz}, ...] offsets from centre
    shapePoints: { type: DataTypes.JSON, allowNull: true },
    // Path waypoints for rivers: [{x, z}, ...] world-space points
    waypoints:   { type: DataTypes.JSON, allowNull: true },
  }, { tableName: 'hydrography' });
};
