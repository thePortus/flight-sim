'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hydrography', {
      id:    { type: Sequelize.INTEGER,     primaryKey: true, autoIncrement: true },
      name:  { type: Sequelize.STRING(100), allowNull: false },
      type: {
        type:         Sequelize.ENUM('lake', 'river'),
        defaultValue: 'lake',
      },
      x:     { type: Sequelize.FLOAT, allowNull: false },
      z:     { type: Sequelize.FLOAT, allowNull: false },
      width: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 100 },
      depth: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 100 },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('hydrography');
  },
};
