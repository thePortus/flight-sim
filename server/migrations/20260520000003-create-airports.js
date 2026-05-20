'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('airports', {
      id:        { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name:      { type: Sequelize.STRING(100), allowNull: false },
      code:      { type: Sequelize.STRING(10), allowNull: false, unique: true },
      x:         { type: Sequelize.FLOAT, allowNull: false },
      z:         { type: Sequelize.FLOAT, allowNull: false },
      elevation: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      type: {
        type:         Sequelize.ENUM('international', 'regional', 'airstrip'),
        defaultValue: 'airstrip',
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });

    await queryInterface.createTable('runways', {
      id:        { type: Sequelize.STRING(50), primaryKey: true },
      airportId: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'airports', key: 'id' },
        onDelete:   'CASCADE',
      },
      heading:   { type: Sequelize.FLOAT, allowNull: false },
      length:    { type: Sequelize.FLOAT, allowNull: false },
      width:     { type: Sequelize.FLOAT, allowNull: false },
      x:         { type: Sequelize.FLOAT, allowNull: false },
      z:         { type: Sequelize.FLOAT, allowNull: false },
      elevation: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('runways');
    await queryInterface.dropTable('airports');
  },
};
