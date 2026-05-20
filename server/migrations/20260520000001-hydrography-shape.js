'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('hydrography', 'shapePoints', {
      type:      Sequelize.JSON,
      allowNull: true,
      comment:   'Array of {dx,dz} offsets from (x,z) centre — clockwise polygon vertices for lakes',
    });
    await queryInterface.addColumn('hydrography', 'waypoints', {
      type:      Sequelize.JSON,
      allowNull: true,
      comment:   'Array of {x,z} world-space path points for rivers/streams',
    });
    // Expand the type enum to include 'ocean' for future use
    await queryInterface.changeColumn('hydrography', 'type', {
      type:         Sequelize.ENUM('lake', 'river', 'ocean'),
      defaultValue: 'lake',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('hydrography', 'shapePoints');
    await queryInterface.removeColumn('hydrography', 'waypoints');
    await queryInterface.changeColumn('hydrography', 'type', {
      type:         Sequelize.ENUM('lake', 'river'),
      defaultValue: 'lake',
    });
  },
};
