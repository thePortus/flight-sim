'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('towns', {
      id:         { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name:       { type: Sequelize.STRING(100), allowNull: false },
      x:          { type: Sequelize.FLOAT, allowNull: false },
      z:          { type: Sequelize.FLOAT, allowNull: false },
      size: {
        type:         Sequelize.ENUM('city', 'town', 'village', 'hamlet'),
        defaultValue: 'village',
      },
      population: { type: Sequelize.INTEGER, defaultValue: 100 },
      createdAt:  { type: Sequelize.DATE },
      updatedAt:  { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('towns');
  },
};
