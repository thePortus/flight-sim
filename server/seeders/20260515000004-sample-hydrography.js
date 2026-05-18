'use strict';

// Placement notes (all features clear all airfield structures by ≥ 160 units):
//
//   Mirror Lake    — far west,  avoids hangars & radar station
//   Airport Pond   — far east,  avoids fuel depot & terminal
//   North River    — E-W band at Z+600, well north of all buildings
//   West Creek     — N-S band at X-430, well west of hangars
//   East Creek     — N-S band at X+350, south of airport pond, no building overlap

const now = new Date();

const features = [
  // ── Lakes ──────────────────────────────────────────────────────────────────
  { name: 'Mirror Lake',   type: 'lake',  x: -450, z: -220, width: 260, depth: 200, createdAt: now, updatedAt: now },
  { name: 'Airport Pond',  type: 'lake',  x:  350, z: -280, width: 100, depth:  80, createdAt: now, updatedAt: now },
  // ── Rivers ─────────────────────────────────────────────────────────────────
  { name: 'North River',   type: 'river', x:    0, z:  600, width: 1000, depth:  30, createdAt: now, updatedAt: now },
  { name: 'West Creek',    type: 'river', x: -430, z:    0, width:   20, depth: 700, createdAt: now, updatedAt: now },
  { name: 'East Creek',    type: 'river', x:  350, z: -480, width:   18, depth: 250, createdAt: now, updatedAt: now },
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('hydrography', features, {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('hydrography', null, {});
  },
};
