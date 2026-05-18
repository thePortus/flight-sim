'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('structures', {
      id:     { type: Sequelize.INTEGER,      primaryKey: true, autoIncrement: true },
      name:   { type: Sequelize.STRING(100),  allowNull: false },
      type: {
        type:         Sequelize.ENUM('building', 'tower', 'hangar'),
        defaultValue: 'building',
      },
      x:      { type: Sequelize.FLOAT, allowNull: false },
      z:      { type: Sequelize.FLOAT, allowNull: false },
      width:  { type: Sequelize.FLOAT, allowNull: false, defaultValue: 10 },
      depth:  { type: Sequelize.FLOAT, allowNull: false, defaultValue: 10 },
      height: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 10 },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('structures');
  },
};
