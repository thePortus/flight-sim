'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('road_paths', {
      id:    { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name:  { type: Sequelize.STRING(100), allowNull: false },
      type: {
        type:         Sequelize.ENUM('highway', 'regional', 'local'),
        defaultValue: 'local',
      },
      // Array of {x, z} world-space waypoints defining the path
      points: { type: Sequelize.JSON, allowNull: false },
      width:  { type: Sequelize.FLOAT, allowNull: false, defaultValue: 5 },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('road_paths');
  },
};
