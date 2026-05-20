module.exports = (sequelize, DataTypes) => {
  return sequelize.define('town', {
    name:       { type: DataTypes.STRING(100), allowNull: false },
    x:          { type: DataTypes.FLOAT, allowNull: false },
    z:          { type: DataTypes.FLOAT, allowNull: false },
    size: {
      type:         DataTypes.ENUM('city', 'town', 'village', 'hamlet'),
      defaultValue: 'village',
    },
    population: { type: DataTypes.INTEGER, defaultValue: 100 },
  }, { tableName: 'towns' });
};
