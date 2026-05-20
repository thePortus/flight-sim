'use strict';

// Deterministic pseudo-random helper
function rng(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Runway exclusion zones: [cx, cz, halfLen, halfWid, headingDeg]
// halfLen extends along the runway heading, halfWid perpendicular.
// All values include a 120-unit safety margin beyond the physical runway.
// Derived from 20260520000012-airports-world.js.
const RUNWAY_EXCLUSIONS = [
  // XCTR — Central International (origin)
  [     0,      0, 1120,  143, 0   ],  // XCTR-18: N-S, 2000 long, 45 wide
  [     0,    600,  920,  140, 90  ],  // XCTR-09: E-W, 1600 long, 40 wide
  // XHBR — Harborview International
  [-43500, -10500, 1220,  145, 270 ],  // XHBR-27: E-W, 2200 long, 50 wide
  [-43000, -11200, 1020,  143, 0   ],  // XHBR-18: N-S, 1800 long, 45 wide
  // XEGT — Eastgate Regional
  [ 42500,   8500, 1020,  141, 90  ],  // XEGT-09: E-W, 1800 long, 42 wide
  // XNMU — Northmere Municipal
  [  8500,  55500,  920,  139, 0   ],  // XNMU-18: N-S, 1600 long, 38 wide
  // XRDG — Ridgemont Valley
  [ 18500,  18500,  870,  138, 90  ],  // XRDG-09: E-W, 1500 long, 36 wide
  // XFMS — Fort Mesa
  [ 26500, -18500,  820,  138, 0   ],  // XFMS-18: N-S, 1400 long, 35 wide
  // XSMF — Southmere Field
  [  6500, -25500,  820,  137, 270 ],  // XSMF-27: E-W, 1400 long, 34 wide
  // XPFS — Pine Falls
  [-13500,  21500,  770,  136, 0   ],  // XPFS-36: N-S, 1300 long, 32 wide
  // XMTR — Mountain Ridge
  [-28500,  22500,  670,  134, 90  ],  // XMTR-09: E-W, 1100 long, 28 wide
  // XDCS — Desert Cross
  [ 22500, -42500,  620,  133, 0   ],  // XDCS-18: N-S, 1000 long, 25 wide
  // XWCR — West Cross
  [-38500,  12500,  620,  133, 270 ],  // XWCR-27: E-W, 1000 long, 26 wide
  // XHGT — Highgate
  [ 12500,  36500,  570,  132, 0   ],  // XHGT-18: N-S, 900 long, 24 wide
  // XDHL — Dunehollow
  [ -8500, -38500,  570,  131, 90  ],  // XDHL-09: E-W, 900 long, 22 wide
  // XIRP — Ironpeak
  [-28000,  28500,  545,  131, 0   ],  // XIRP-18: N-S, 850 long, 22 wide
  // XBRC — Boreal Crossing
  [-18500,  55500,  620,  132, 270 ],  // XBRC-27: E-W, 1000 long, 24 wide
  // XFPT — Farpoint
  [ 62500, -22500,  545,  131, 0   ],  // XFPT-18: N-S, 850 long, 22 wide
  // XSBK — Sandbrook
  [ 22500, -42000,  570,  131, 90  ],  // XSBK-09: E-W, 900 long, 22 wide
  // XTDR — Tundra Gate
  [ -6500,  68500,  520,  130, 0   ],  // XTDR-18: N-S, 800 long, 20 wide
  // XPLC — Pale Canyon
  [ 28500, -55500,  520,  130, 270 ],  // XPLC-27: E-W, 800 long, 20 wide
  // XCSH — Coasthaven
  [-55500,   2500,  620,  134, 90  ],  // XCSH-09: E-W, 1000 long, 28 wide
];

/** Returns true if (x, z) falls inside any runway exclusion zone. */
function insideExclusion(x, z) {
  for (const [cx, cz, hl, hw, hdg] of RUNWAY_EXCLUSIONS) {
    const rad = hdg * Math.PI / 180;
    const cos = Math.cos(rad), sin = Math.sin(rad);
    const dx = x - cx, dz = z - cz;
    // Rotate displacement into runway-local frame.
    // lx = across the runway (width axis), lz = along the runway (length axis).
    const lx =  dx * cos + dz * sin;
    const lz = -dx * sin + dz * cos;
    // lz is along the runway length, lx is across the runway width.
    if (Math.abs(lz) <= hl && Math.abs(lx) <= hw) return true;
  }
  return false;
}

// Generate structures for a settlement cluster, skipping runway exclusion zones.
// All 5 RNG calls per candidate are consumed regardless of exclusion so the
// sequence stays deterministic — extra attempts backfill rejected slots.
function cluster(cx, cz, count, density, minH, maxH, types, seed) {
  const rand    = rng(seed);
  const out     = [];
  const maxTry  = count * 6;
  for (let tries = 0; out.length < count && tries < maxTry; tries++) {
    const angle = rand() * Math.PI * 2;
    const dist  = rand() * density;
    const x     = Math.round(cx + Math.cos(angle) * dist);
    const z     = Math.round(cz + Math.sin(angle) * dist);
    const type  = types[Math.floor(rand() * types.length)];
    const h     = minH + rand() * (maxH - minH);
    const w     = h * (0.5 + rand() * 1.0);
    const d     = h * (0.5 + rand() * 1.0);
    if (insideExclusion(x, z)) continue;
    out.push({
      type, x, z,
      width:  parseFloat(w.toFixed(1)),
      depth:  parseFloat(d.toFixed(1)),
      height: parseFloat(h.toFixed(1)),
    });
  }
  return out;
}

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // Towns with their own cluster specs (cx, cz, count, density, minH, maxH, types, seed)
    const settlements = [
      // Cities
      { name: 'Centropolis core',      cx:    -300, cz:   -500, n:  90, d: 800, minH: 12, maxH: 80, t: ['building','tower'],              seed: 101 },
      { name: 'Centropolis suburbs',   cx:    -600, cz:   -100, n:  40, d: 1200, minH:  8, maxH: 20, t: ['building'],                     seed: 102 },
      { name: 'Harborview core',       cx:  -43000, cz: -10000, n:  80, d: 700, minH: 10, maxH: 70, t: ['building','tower'],              seed: 103 },
      { name: 'Harborview port',       cx:  -43800, cz:  -9200, n:  30, d: 600, minH:  8, maxH: 18, t: ['hangar','building'],             seed: 104 },
      { name: 'Eastgate core',         cx:   42000, cz:   8000, n:  80, d: 700, minH: 10, maxH: 65, t: ['building','tower'],              seed: 105 },
      { name: 'Eastgate industrial',   cx:   42800, cz:   8800, n:  30, d: 500, minH:  8, maxH: 22, t: ['building','hangar'],             seed: 106 },
      { name: 'Northmere core',        cx:    8000, cz:  55000, n:  70, d: 650, minH: 10, maxH: 55, t: ['building','tower'],              seed: 107 },
      { name: 'Northmere outskirts',   cx:    8800, cz:  55600, n:  25, d: 500, minH:  6, maxH: 16, t: ['building'],                      seed: 108 },
      // Towns
      { name: 'Ridgemont',            cx:   18000, cz:  18000, n:  35, d: 500, minH:  8, maxH: 30, t: ['building','tower'],              seed: 110 },
      { name: 'Clearwater',           cx:  -22000, cz:   8000, n:  32, d: 480, minH:  7, maxH: 25, t: ['building','tower'],              seed: 111 },
      { name: 'Fort Mesa',            cx:   26000, cz: -18000, n:  30, d: 450, minH:  8, maxH: 28, t: ['building','tower'],              seed: 112 },
      { name: 'Southmere',            cx:    6000, cz: -25000, n:  28, d: 420, minH:  7, maxH: 24, t: ['building'],                      seed: 113 },
      { name: 'Pine Falls',           cx:  -13000, cz:  21000, n:  26, d: 400, minH:  6, maxH: 22, t: ['building','tower'],              seed: 114 },
      { name: 'Highgate',             cx:   12000, cz:  36000, n:  24, d: 380, minH:  6, maxH: 20, t: ['building'],                      seed: 115 },
      { name: 'West Cross',           cx:  -38000, cz:  12000, n:  24, d: 380, minH:  6, maxH: 20, t: ['building','tower'],              seed: 116 },
      { name: 'Dunehollow',           cx:   -8000, cz: -38000, n:  22, d: 360, minH:  6, maxH: 18, t: ['building'],                      seed: 117 },
      { name: 'Ironpeak',             cx:  -28000, cz:  28000, n:  20, d: 340, minH:  8, maxH: 22, t: ['building','tower'],              seed: 118 },
      { name: 'Riverton',             cx:   -4000, cz:  22000, n:  20, d: 340, minH:  6, maxH: 18, t: ['building'],                      seed: 119 },
      { name: 'Sandbrook',            cx:   22000, cz: -42000, n:  18, d: 320, minH:  6, maxH: 16, t: ['building'],                      seed: 120 },
      { name: 'Lakewood',             cx:    7000, cz: -14000, n:  18, d: 320, minH:  6, maxH: 18, t: ['building'],                      seed: 121 },
      { name: 'Farpoint',             cx:   62000, cz: -22000, n:  16, d: 300, minH:  6, maxH: 16, t: ['building','tower'],              seed: 122 },
      { name: 'Boreal Crossing',      cx:  -18000, cz:  55000, n:  15, d: 280, minH:  6, maxH: 14, t: ['building'],                      seed: 123 },
      { name: 'Coasthaven',           cx:  -55000, cz:   2000, n:  15, d: 280, minH:  6, maxH: 18, t: ['building','hangar'],             seed: 124 },
      // Villages (smaller clusters)
      { name: 'East Brook',           cx:    4400, cz:   -400, n:  12, d: 220, minH:  5, maxH: 14, t: ['building'],                      seed: 130 },
      { name: 'North Haven',          cx:   -6000, cz:   3100, n:  10, d: 200, minH:  5, maxH: 12, t: ['building'],                      seed: 131 },
      { name: 'River Bend',           cx:  -18000, cz: -23000, n:  10, d: 200, minH:  5, maxH: 12, t: ['building'],                      seed: 132 },
      { name: 'Westport',             cx:  -35000, cz:   -400, n:  10, d: 200, minH:  5, maxH: 12, t: ['building','tower'],              seed: 133 },
      { name: 'Coppervale',           cx:   -8000, cz:  12000, n:   9, d: 180, minH:  5, maxH: 12, t: ['building'],                      seed: 134 },
      { name: 'Millhaven',            cx:   14000, cz:   2000, n:   9, d: 180, minH:  5, maxH: 12, t: ['building'],                      seed: 135 },
      { name: 'Thornfield',           cx:   32000, cz:  -4000, n:   9, d: 180, minH:  5, maxH: 12, t: ['building'],                      seed: 136 },
      { name: 'Granite Pass',         cx:  -38000, cz:  28000, n:   8, d: 160, minH:  6, maxH: 14, t: ['building','tower'],              seed: 137 },
      { name: 'Skyreach',             cx:  -24000, cz:  18000, n:   8, d: 160, minH:  6, maxH: 14, t: ['building','tower'],              seed: 138 },
      { name: 'Dusthaven',            cx:   16000, cz: -28000, n:   8, d: 160, minH:  5, maxH: 10, t: ['building'],                      seed: 139 },
      { name: 'Coldspring',           cx:   -2000, cz:  42000, n:   8, d: 160, minH:  5, maxH: 10, t: ['building'],                      seed: 140 },
      { name: 'Amber Fields',         cx:   36000, cz:  18000, n:   8, d: 160, minH:  5, maxH: 10, t: ['building'],                      seed: 141 },
      { name: 'Brookside',            cx:   -1800, cz: -10000, n:   7, d: 140, minH:  5, maxH: 10, t: ['building'],                      seed: 142 },
      { name: 'Ferndale',             cx:   22000, cz:  32000, n:   7, d: 140, minH:  5, maxH: 10, t: ['building'],                      seed: 143 },
      { name: 'Old Crossing',         cx:  -28000, cz:  -4000, n:   7, d: 140, minH:  5, maxH: 10, t: ['building'],                      seed: 144 },
      { name: 'Driftwood',            cx:  -52000, cz:   8000, n:   7, d: 140, minH:  5, maxH: 10, t: ['building'],                      seed: 145 },
      { name: 'Summit Rest',          cx:  -32000, cz:  22000, n:   6, d: 120, minH:  6, maxH: 12, t: ['building'],                      seed: 146 },
      { name: 'Pale Canyon',          cx:   28000, cz: -55000, n:   6, d: 120, minH:  5, maxH: 10, t: ['building'],                      seed: 147 },
      { name: 'Glasswater',           cx:   -9000, cz:  28000, n:   6, d: 120, minH:  5, maxH: 10, t: ['building'],                      seed: 148 },
      { name: 'Tundra Gate',          cx:   -6000, cz:  68000, n:   6, d: 120, minH:  5, maxH: 10, t: ['building'],                      seed: 149 },
      { name: 'Crosshaven',           cx:   10000, cz: -48000, n:   6, d: 120, minH:  5, maxH: 10, t: ['building'],                      seed: 150 },
      { name: 'Ember Rock',           cx:   48000, cz:  -8000, n:   6, d: 120, minH:  5, maxH: 10, t: ['building'],                      seed: 151 },
      { name: 'Marshwick',            cx:  -12000, cz:  -6000, n:   6, d: 120, minH:  5, maxH: 10, t: ['building'],                      seed: 152 },
      { name: 'Farside',              cx:   72000, cz:  12000, n:   5, d: 100, minH:  5, maxH: 10, t: ['building','tower'],              seed: 153 },
      { name: 'Lowfen',               cx:  -46000, cz: -18000, n:   5, d: 100, minH:  5, maxH: 10, t: ['building'],                      seed: 154 },
      { name: 'North Reach',          cx:   28000, cz:  52000, n:   5, d: 100, minH:  5, maxH: 10, t: ['building'],                      seed: 155 },
      { name: 'Pinecroft',            cx:  -16000, cz:  36000, n:   5, d: 100, minH:  5, maxH: 10, t: ['building'],                      seed: 156 },
      // Airport bonus structures — placed at the sides of runways, not on them
      { name: 'XCTR airport',         cx:      50, cz:     80, n:  16, d: 250, minH:  8, maxH: 40, t: ['tower','hangar','building'],      seed: 200 },
      { name: 'XHBR airport',         cx:  -43500, cz: -10500, n:  14, d: 220, minH:  8, maxH: 35, t: ['tower','hangar','building'],      seed: 201 },
      { name: 'XEGT airport',         cx:   42500, cz:   8500, n:  12, d: 200, minH:  8, maxH: 30, t: ['tower','hangar','building'],      seed: 202 },
      { name: 'XNMU airport',         cx:    8500, cz:  55500, n:  10, d: 180, minH:  6, maxH: 25, t: ['tower','hangar'],                seed: 203 },
      { name: 'XRDG airport',         cx:   18500, cz:  18500, n:   8, d: 160, minH:  6, maxH: 20, t: ['tower','hangar'],                seed: 204 },
      { name: 'XFMS airport',         cx:   26500, cz: -18500, n:   8, d: 160, minH:  6, maxH: 20, t: ['tower','hangar'],                seed: 205 },
      // Isolated landmarks
      { name: 'Desert tower',         cx:   18000, cz: -58000, n:   2, d:  80, minH: 25, maxH: 45, t: ['tower'],                         seed: 300 },
      { name: 'Mountain relay',       cx:  -34000, cz:  26000, n:   2, d:  60, minH: 20, maxH: 35, t: ['tower'],                         seed: 301 },
      { name: 'Far east relay',       cx:   68000, cz: -10000, n:   2, d:  60, minH: 20, maxH: 30, t: ['tower'],                         seed: 302 },
      { name: 'Northern beacon',      cx:    4000, cz:  76000, n:   2, d:  50, minH: 18, maxH: 28, t: ['tower'],                         seed: 303 },
      { name: 'Southern outpost',     cx:    2000, cz: -72000, n:   3, d: 100, minH:  6, maxH: 18, t: ['building','tower'],              seed: 304 },
      { name: 'East coast outpost',   cx:   75000, cz:   8000, n:   3, d: 100, minH:  6, maxH: 16, t: ['building','tower'],              seed: 305 },
      { name: 'West frontier post',   cx:  -74000, cz: -12000, n:   3, d:  80, minH:  6, maxH: 14, t: ['building'],                      seed: 306 },
      { name: 'Remote cabin',         cx:  -48000, cz:  52000, n:   2, d:  50, minH:  4, maxH:  8, t: ['building'],                      seed: 307 },
      { name: 'Desert ruin',          cx:   42000, cz: -58000, n:   2, d:  60, minH:  4, maxH:  8, t: ['building'],                      seed: 308 },
      { name: 'Frozen outpost',       cx:  -12000, cz:  78000, n:   2, d:  60, minH:  6, maxH: 12, t: ['building','tower'],              seed: 309 },
    ];

    const NAMES = {
      building: ['Hall','Block','House','Lodge','Cottage','Store','Barn','Mill','Inn','Depot','Office','Barracks','Workshop','Shelter'],
      tower:    ['Tower','Mast','Pylon','Spire','Post','Antenna','Beacon'],
      hangar:   ['Hangar','Shed','Bay','Dock','Warehouse'],
    };

    const rows = [];
    for (const s of settlements) {
      const rand  = rng(s.seed + 9999);
      const parts = cluster(s.cx, s.cz, s.n, s.d, s.minH, s.maxH, s.t, s.seed);
      for (let i = 0; i < parts.length; i++) {
        const p     = parts[i];
        const pool  = NAMES[p.type] || NAMES.building;
        const label = pool[Math.floor(rand() * pool.length)];
        rows.push({
          name:      `${label} ${(i + 1).toString()}`,
          type:      p.type,
          x:         p.x,
          z:         p.z,
          width:     p.width,
          depth:     p.depth,
          height:    p.height,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert('structures', rows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('structures', null, {});
  },
};
