module.exports = (sequelize, DataTypes) => {
  return sequelize.define('road_path', {
    name:  { type: DataTypes.STRING(100), allowNull: false },
    type: {
      type:         DataTypes.ENUM('highway', 'regional', 'local'),
      defaultValue: 'local',
    },
    points: { type: DataTypes.JSON, allowNull: false },
    width:  { type: DataTypes.FLOAT, allowNull: false, defaultValue: 5 },
  }, { tableName: 'road_paths' });
};
