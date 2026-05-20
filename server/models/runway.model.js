module.exports = (sequelize, DataTypes) => {
  return sequelize.define('runway', {
    id:        { type: DataTypes.STRING(50), primaryKey: true },
    airportId: { type: DataTypes.INTEGER, allowNull: false },
    heading:   { type: DataTypes.FLOAT, allowNull: false },
    length:    { type: DataTypes.FLOAT, allowNull: false },
    width:     { type: DataTypes.FLOAT, allowNull: false },
    x:         { type: DataTypes.FLOAT, allowNull: false },
    z:         { type: DataTypes.FLOAT, allowNull: false },
    elevation: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  }, { tableName: 'runways' });
};
