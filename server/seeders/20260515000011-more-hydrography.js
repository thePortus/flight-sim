'use strict';

// 15 additional hydrography features spread across the world.
// Combined with the existing 5, the world will have 20 lakes/rivers.

const now = new Date();

const features = [
  // ── Lakes ─────────────────────────────────────────────────────────────────
  { name: 'Great Western Lake',  type: 'lake',  x: -1800, z:   700, width: 600, depth: 450, createdAt: now, updatedAt: now },
  { name: 'East Lagoon',         type: 'lake',  x:  2500, z:   400, width: 350, depth: 280, createdAt: now, updatedAt: now },
  { name: 'Crystal Lake',        type: 'lake',  x:   200, z:  2200, width: 320, depth: 250, createdAt: now, updatedAt: now },
  { name: 'South Marsh',         type: 'lake',  x:   500, z: -2000, width: 200, depth: 160, createdAt: now, updatedAt: now },
  { name: 'Mountain Tarn',       type: 'lake',  x: -2800, z:  -500, width: 150, depth: 120, createdAt: now, updatedAt: now },
  { name: 'Ice Pond',            type: 'lake',  x:  -400, z:  3200, width: 180, depth: 140, createdAt: now, updatedAt: now },
  { name: 'Tech Reservoir',      type: 'lake',  x:  2100, z:  -800, width: 250, depth: 200, createdAt: now, updatedAt: now },
  { name: 'Blue Lagoon',         type: 'lake',  x:  3500, z:   200, width: 400, depth: 350, createdAt: now, updatedAt: now },

  // ── Rivers ────────────────────────────────────────────────────────────────
  { name: 'South River',         type: 'river', x:     0, z: -1500, width: 1200, depth:  25, createdAt: now, updatedAt: now },
  { name: 'East River',          type: 'river', x:  1500, z:     0, width:   22, depth: 1400, createdAt: now, updatedAt: now },
  { name: 'Central Canal',       type: 'river', x:  -300, z:   200, width:  800, depth:   15, createdAt: now, updatedAt: now },
  { name: 'Mountain Stream',     type: 'river', x: -2500, z:  -200, width:   15, depth:  600, createdAt: now, updatedAt: now },
  { name: 'Northern Creek',      type: 'river', x:   800, z:  2500, width:  600, depth:   18, createdAt: now, updatedAt: now },
  { name: 'Deep Gorge River',    type: 'river', x:  -800, z: -1800, width:   20, depth:  800, createdAt: now, updatedAt: now },
  { name: 'Far North River',     type: 'river', x:     0, z:  3800, width: 1400, depth:   35, createdAt: now, updatedAt: now },
];

module.exports = {
  up:   async qi => qi.bulkInsert('hydrography', features, {}),
  down: async qi => qi.bulkDelete('hydrography', { name: features.map(f => f.name) }, {}),
};
