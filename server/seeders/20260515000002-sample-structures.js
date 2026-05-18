'use strict';

// 9 sample structures forming a small airfield near the player's spawn (0, 0, 0)
const now = new Date();

const structures = [
  // Control tower — tall, centre of the field
  { name: 'Control Tower',  type: 'tower',    x:   50, z:   80, width:  8, depth:  8, height: 40, createdAt: now, updatedAt: now },
  // Main hangars
  { name: 'Hangar A',       type: 'hangar',   x: -100, z:   60, width: 40, depth: 30, height: 15, createdAt: now, updatedAt: now },
  { name: 'Hangar B',       type: 'hangar',   x: -100, z:  110, width: 40, depth: 30, height: 15, createdAt: now, updatedAt: now },
  // Terminal building
  { name: 'Terminal',       type: 'building', x:    0, z: -150, width: 60, depth: 25, height: 12, createdAt: now, updatedAt: now },
  // Support buildings
  { name: 'Fuel Depot',     type: 'building', x:  150, z:  -50, width: 15, depth: 20, height:  8, createdAt: now, updatedAt: now },
  { name: 'Storage Shed',   type: 'building', x:  200, z:  200, width: 20, depth: 15, height: 10, createdAt: now, updatedAt: now },
  { name: 'Barracks',       type: 'building', x:  100, z:  200, width: 25, depth: 12, height:  8, createdAt: now, updatedAt: now },
  // Towers
  { name: 'Radar Station',  type: 'tower',    x: -200, z: -100, width:  6, depth:  6, height: 25, createdAt: now, updatedAt: now },
  { name: 'Water Tower',    type: 'tower',    x:  -60, z:  -80, width:  5, depth:  5, height: 35, createdAt: now, updatedAt: now },
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('structures', structures, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('structures', null, {});
  },
};
