module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define('airport', {
    name:      { type: DataTypes.STRING(100), allowNull: false },
    code:      { type: DataTypes.STRING(10),  allowNull: false, unique: true },
    x:         { type: DataTypes.FLOAT, allowNull: false },
    z:         { type: DataTypes.FLOAT, allowNull: false },
    elevation: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    type: {
      type:         DataTypes.ENUM('international', 'regional', 'airstrip'),
      defaultValue: 'airstrip',
    },
  }, { tableName: 'airports' });
  return Airport;
};
