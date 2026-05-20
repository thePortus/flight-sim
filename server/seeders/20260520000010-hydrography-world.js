'use strict';

// Generates an irregular polygon for a lake.
// sides: number of vertices; variance: 0–1 how jagged (0 = circle, 1 = very jagged)
function lakePoly(cx, cz, radius, sides = 10, variance = 0.38, seed = 1) {
  function h(a, b) {
    const n = Math.sin(a * 127.1 + b * 311.7 + seed * 74.3) * 43758.5453;
    return n - Math.floor(n);
  }
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + h(i, 99) * 0.3 - 0.15;
    const r = radius * (1 - variance / 2 + variance * h(i, seed));
    points.push({ dx: parseFloat((Math.cos(angle) * r).toFixed(1)),
                  dz: parseFloat((Math.sin(angle) * r).toFixed(1)) });
  }
  return points;
}

// River waypoints helper: builds a gently curved path from start to end
// by adding intermediate control points with lateral offsets.
function riverPath(sx, sz, ex, ez, segments = 4, spread = 800, seed = 1) {
  function h(a, b) {
    const n = Math.sin(a * 127.1 + b * 311.7 + seed * 74.3) * 43758.5453;
    return n - Math.floor(n);
  }
  const pts = [{ x: sx, z: sz }];
  for (let i = 1; i < segments; i++) {
    const t   = i / segments;
    const bx  = sx + (ex - sx) * t;
    const bz  = sz + (ez - sz) * t;
    // Perpendicular offset
    const dx  = -(ez - sz), dz = (ex - sx);
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const off = (h(i, seed) - 0.5) * 2 * spread;
    pts.push({
      x: parseFloat((bx + (dx / len) * off).toFixed(0)),
      z: parseFloat((bz + (dz / len) * off).toFixed(0)),
    });
  }
  pts.push({ x: ex, z: ez });
  return pts;
}

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // ── Lakes ────────────────────────────────────────────────────────────────
    const lakes = [
      // Great lakes (radius 800–1500)
      { name: 'Great Northern Sea',    x:  -8000, z: 52000, radius: 1400, sides: 14, variance: 0.42, seed: 1  },
      { name: 'Lake Eastmere',         x:  38000, z:  8000, radius: 1100, sides: 12, variance: 0.35, seed: 2  },
      { name: 'Westland Lake',         x: -42000, z: -18000, radius: 950, sides: 11, variance: 0.40, seed: 3  },
      { name: 'Southern Salt Flat',    x:  12000, z: -58000, radius: 850, sides: 10, variance: 0.28, seed: 4  },
      // Medium lakes (radius 200–600)
      { name: 'Mirror Lake',           x:   -450, z:   -220, radius: 280, sides: 9,  variance: 0.35, seed: 5  },
      { name: 'Crystal Lake',          x:   1800, z:  22000, radius: 380, sides: 10, variance: 0.45, seed: 6  },
      { name: 'Pine Lake',             x: -12000, z:  18000, radius: 440, sides: 11, variance: 0.38, seed: 7  },
      { name: 'Glacier Tarn',          x: -28000, z:  32000, radius: 320, sides: 8,  variance: 0.22, seed: 8  },
      { name: 'East Lagoon',           x:  52000, z:   4000, radius: 500, sides: 12, variance: 0.44, seed: 9  },
      { name: 'Mountain Lake',         x: -32000, z:  18000, radius: 420, sides: 10, variance: 0.30, seed: 10 },
      { name: 'Harborview Bay',        x: -42000, z:  -6000, radius: 560, sides: 13, variance: 0.50, seed: 11 },
      { name: 'Desert Oasis',          x:  22000, z: -38000, radius: 200, sides: 8,  variance: 0.20, seed: 12 },
      { name: 'Ridgeline Reservoir',   x:  28000, z:  18000, radius: 350, sides: 9,  variance: 0.32, seed: 13 },
      { name: 'Boreal Pool',           x:  -5000, z:  65000, radius: 480, sides: 11, variance: 0.42, seed: 14 },
      { name: 'Lowland Mere',          x: -18000, z:  -8000, radius: 300, sides: 9,  variance: 0.48, seed: 15 },
      { name: 'Tech Reservoir',        x:  42000, z: -12000, radius: 390, sides: 10, variance: 0.25, seed: 16 },
      { name: 'Canyon Sump',           x:  18000, z: -48000, radius: 260, sides: 8,  variance: 0.30, seed: 17 },
      { name: 'Northern Fen',          x: -22000, z:  48000, radius: 540, sides: 12, variance: 0.52, seed: 18 },
      { name: 'Farmland Pond',         x:  32000, z:  28000, radius: 220, sides: 8,  variance: 0.35, seed: 19 },
      { name: 'Airport Pond',          x:    350, z:   -280, radius: 110, sides: 8,  variance: 0.30, seed: 20 },
      // Small ponds (radius 40–150)
      { name: 'Millpond',              x:  -1800, z:  -2200, radius: 90,  sides: 7,  variance: 0.40, seed: 21 },
      { name: 'Sheep Pool',            x:   3200, z:  -1500, radius: 70,  sides: 7,  variance: 0.35, seed: 22 },
      { name: 'Quarry Lake',           x: -14000, z:  -5000, radius: 120, sides: 8,  variance: 0.25, seed: 23 },
      { name: 'Hidden Tarn',           x:  -9000, z:  28000, radius: 80,  sides: 6,  variance: 0.45, seed: 24 },
      { name: 'Summit Pond',           x: -34000, z:  22000, radius: 60,  sides: 6,  variance: 0.20, seed: 25 },
      { name: 'Forest Pool',           x:   8000, z:  42000, radius: 95,  sides: 7,  variance: 0.50, seed: 26 },
      { name: 'Stony Brook Pool',      x:  18000, z:  12000, radius: 75,  sides: 7,  variance: 0.38, seed: 27 },
      { name: 'Willow Pond',           x:  -6000, z:  -8000, radius: 85,  sides: 7,  variance: 0.42, seed: 28 },
      { name: 'Marsh Basin',           x: -28000, z: -14000, radius: 150, sides: 9,  variance: 0.55, seed: 29 },
      { name: 'Ranch Tank',            x:  48000, z:  22000, radius: 55,  sides: 6,  variance: 0.25, seed: 30 },
      { name: 'Crater Lake',           x:  -5000, z: -42000, radius: 130, sides: 8,  variance: 0.18, seed: 31 },
      { name: 'Gravel Pit Pond',       x:  24000, z: -22000, radius: 100, sides: 7,  variance: 0.30, seed: 32 },
      { name: 'Birch Hollow',          x: -15000, z:  38000, radius: 88,  sides: 7,  variance: 0.45, seed: 33 },
      { name: 'Ice Melt Pool',         x:  -2000, z:  72000, radius: 140, sides: 8,  variance: 0.22, seed: 34 },
      { name: 'Tidal Basin',           x: -48000, z:  -2000, radius: 120, sides: 8,  variance: 0.58, seed: 35 },
    ];

    // ── Rivers ───────────────────────────────────────────────────────────────
    const rivers = [
      // Major rivers (width 22–30, 5–8 waypoints)
      { name: 'Great North River',  sx: -32000, sz:  38000, ex:  -8000, ez: -15000, w: 28, seg: 7, spread: 1200, seed: 41 },
      { name: 'Eastern Run',        sx:  42000, sz:  28000, ex:  22000, ez: -30000, w: 25, seg: 6, spread: 1000, seed: 42 },
      { name: 'Central Canal',      sx:  -8000, sz:  12000, ex:   6000, ez: -14000, w: 22, seg: 5, spread:  700, seed: 43 },
      { name: 'Desert Wadi',        sx:   8000, sz: -20000, ex:  18000, ez: -65000, w: 20, seg: 6, spread:  900, seed: 44 },
      { name: 'Forest River',       sx: -18000, sz:  55000, ex:  -6000, ez:  22000, w: 24, seg: 6, spread: 1100, seed: 45 },
      // Minor rivers (width 10–18)
      { name: 'West Creek',         sx: -22000, sz:   2000, ex: -35000, ez: -20000, w: 14, seg: 4, spread:  500, seed: 46 },
      { name: 'North Creek',        sx:   2000, sz:  38000, ex:  -4000, ez:  18000, w: 12, seg: 4, spread:  600, seed: 47 },
      { name: 'Mountain Stream',    sx: -38000, sz:  28000, ex: -24000, ez:  12000, w: 10, seg: 5, spread:  400, seed: 48 },
      { name: 'High Plains River',  sx:  18000, sz:   8000, ex:  38000, ez:  28000, w: 16, seg: 5, spread:  700, seed: 49 },
      { name: 'South Fork',         sx:   4000, sz: -12000, ex:  16000, ez: -35000, w: 13, seg: 4, spread:  500, seed: 50 },
      { name: 'Coastal Inlet',      sx: -45000, sz:  -4000, ex: -35000, ez:   8000, w: 18, seg: 4, spread:  600, seed: 51 },
      { name: 'Tundra Stream',      sx:  -8000, sz:  68000, ex:  -2000, ez:  52000, w: 11, seg: 4, spread:  450, seed: 52 },
      // Creeks (width 5–10)
      { name: 'Mill Creek',         sx:  -1200, sz:   2000, ex:   1500, ez:  -3000, w:  7, seg: 3, spread:  300, seed: 53 },
      { name: 'Stony Creek',        sx:  12000, sz:  -3000, ex:  18000, ez:  -9000, w:  6, seg: 3, spread:  280, seed: 54 },
      { name: 'Bog Run',            sx: -26000, sz:  -6000, ex: -18000, ez:  -2000, w:  8, seg: 3, spread:  350, seed: 55 },
      { name: 'Snowmelt Creek',     sx: -30000, sz:  32000, ex: -22000, ez:  26000, w:  6, seg: 3, spread:  250, seed: 56 },
      { name: 'Harvest Creek',      sx:  26000, sz:  10000, ex:  32000, ez:   4000, w:  7, seg: 3, spread:  320, seed: 57 },
      { name: 'Dry Gulch',          sx:  10000, sz: -28000, ex:  14000, ez: -36000, w:  5, seg: 3, spread:  300, seed: 58 },
      { name: 'Pine Hollow Creek',  sx:  -6000, sz:  30000, ex:  -2000, ez:  22000, w:  6, seg: 3, spread:  280, seed: 59 },
      { name: 'East Rill',          sx:  44000, sz:  -2000, ex:  38000, ez:  -8000, w:  5, seg: 3, spread:  240, seed: 60 },
    ];

    // Build lake rows
    const lakeRows = lakes.map((l, i) => ({
      name:        l.name,
      type:        'lake',
      x:           l.x,
      z:           l.z,
      width:       l.radius * 2,
      depth:       l.radius * 2,
      shapePoints: JSON.stringify(lakePoly(l.x, l.z, l.radius, l.sides, l.variance, l.seed)),
      waypoints:   null,
      createdAt:   now,
      updatedAt:   now,
    }));

    // Build river rows
    const riverRows = rivers.map(r => ({
      name:        r.name,
      type:        'river',
      x:           Math.round((r.sx + r.ex) / 2),
      z:           Math.round((r.sz + r.ez) / 2),
      width:       r.w,
      depth:       r.w,
      shapePoints: null,
      waypoints:   JSON.stringify(riverPath(r.sx, r.sz, r.ex, r.ez, r.seg, r.spread, r.seed)),
      createdAt:   now,
      updatedAt:   now,
    }));

    await queryInterface.bulkInsert('hydrography', [...lakeRows, ...riverRows]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('hydrography', null, {});
  },
};
