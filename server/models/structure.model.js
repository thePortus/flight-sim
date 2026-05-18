module.exports = (sequelize, DataTypes) => {
  return sequelize.define('structure', {
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: {
      type: DataTypes.ENUM('building', 'tower', 'hangar'),
      defaultValue: 'building',
    },
    // World-space position (Y is always ground level — height/2 gives mesh centre)
    x: { type: DataTypes.FLOAT, allowNull: false },
    z: { type: DataTypes.FLOAT, allowNull: false },
    // Dimensions
    width:  { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 },
    depth:  { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 },
    height: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 },
  });
};
