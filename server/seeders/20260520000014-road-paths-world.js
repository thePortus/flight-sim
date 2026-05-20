'use strict';

// Build a gently curved path from (sx,sz) to (ex,ez) with `segs` intermediate
// points. `spread` is the max lateral offset for each mid-point.
function path(sx, sz, ex, ez, segs = 3, spread = 600, seed = 1) {
  function h(a) {
    const n = Math.sin(a * 127.1 + seed * 74.3) * 43758.5453;
    return n - Math.floor(n);
  }
  const pts = [{ x: sx, z: sz }];
  for (let i = 1; i <= segs; i++) {
    const t  = i / (segs + 1);
    const bx = sx + (ex - sx) * t;
    const bz = sz + (ez - sz) * t;
    const dx = -(ez - sz), dz = ex - sx;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const off = (h(i) - 0.5) * 2 * spread;
    pts.push({
      x: Math.round(bx + (dx / len) * off),
      z: Math.round(bz + (dz / len) * off),
    });
  }
  pts.push({ x: ex, z: ez });
  return pts;
}

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // ── Highways (width 14, connecting cities and major towns) ────────────────
    const highways = [
      { name: 'Central–Ridgemont Hwy',      sx:  -300, sz:  -500, ex:  18000, ez:  18000, s: 4, sp: 1000, seed: 1  },
      { name: 'Central–Fort Mesa Hwy',       sx:  -300, sz:  -500, ex:  26000, ez: -18000, s: 4, sp:  900, seed: 2  },
      { name: 'Central–Pine Falls Hwy',      sx:  -300, sz:  -500, ex: -13000, ez:  21000, s: 4, sp:  800, seed: 3  },
      { name: 'Central–Lakewood Hwy',        sx:  -300, sz:  -500, ex:   7000, ez: -14000, s: 3, sp:  600, seed: 4  },
      { name: 'Central–Clearwater Hwy',      sx:  -300, sz:  -500, ex: -22000, ez:   8000, s: 4, sp:  900, seed: 5  },
      { name: 'Central–Southmere Hwy',       sx:  -300, sz:  -500, ex:   6000, ez: -25000, s: 4, sp:  800, seed: 6  },
      { name: 'Eastgate Ring Road',          sx:  42000, sz:   8000, ex:  26000, ez: -18000, s: 4, sp:  800, seed: 7  },
      { name: 'Eastgate–Ridgemont Hwy',      sx:  42000, sz:   8000, ex:  18000, ez:  18000, s: 3, sp:  700, seed: 8  },
      { name: 'Northmere–Highgate Hwy',      sx:   8000, sz:  55000, ex:  12000, ez:  36000, s: 3, sp:  700, seed: 9  },
      { name: 'Northmere–Boreal Hwy',        sx:   8000, sz:  55000, ex: -18000, ez:  55000, s: 3, sp:  600, seed: 10 },
      { name: 'Harborview–Clearwater Hwy',   sx: -43000, sz: -10000, ex: -22000, ez:   8000, s: 4, sp:  900, seed: 11 },
      { name: 'Harborview–West Cross Hwy',   sx: -43000, sz: -10000, ex: -38000, ez:  12000, s: 3, sp:  700, seed: 12 },
      { name: 'Desert Cross Artery',         sx:   6000, sz: -25000, ex:  22000, ez: -42000, s: 3, sp:  700, seed: 13 },
      { name: 'Far East Corridor',           sx:  42000, sz:   8000, ex:  62000, ez: -22000, s: 4, sp:  900, seed: 14 },
      { name: 'Mountain Pass Road',          sx: -22000, sz:   8000, ex: -28000, ez:  28000, s: 4, sp:  600, seed: 15 },
      { name: 'North Forest Trunk',          sx:  -4000, sz:  22000, ex:   8000, ez:  55000, s: 5, sp:  800, seed: 16 },
      { name: 'Southern Desert Trunk',       sx:   6000, sz: -25000, ex:  -8000, ez: -38000, s: 3, sp:  700, seed: 17 },
      { name: 'Coastal Highway',             sx: -43000, sz: -10000, ex: -55000, ez:   2000, s: 4, sp:  800, seed: 18 },
      { name: 'Ironpeak Pass Road',          sx: -22000, sz:   8000, ex: -38000, ez:  12000, s: 3, sp:  500, seed: 19 },
      { name: 'Eastern Farmland Trunk',      sx:  18000, sz:  18000, ex:  36000, ez:  18000, s: 3, sp:  600, seed: 20 },
      { name: 'Ridgemont–Ferndale Hwy',      sx:  18000, sz:  18000, ex:  22000, ez:  32000, s: 3, sp:  500, seed: 21 },
      { name: 'Far Northern Road',           sx:   8000, sz:  55000, ex:   4000, ez:  72000, s: 4, sp:  700, seed: 22 },
      { name: 'Southwest Desert Road',       sx:  -8000, sz: -38000, ex: -28000, ez: -38000, s: 3, sp:  600, seed: 23 },
      { name: 'Dunehollow–Sandbrook Rd',     sx:  -8000, sz: -38000, ex:  22000, ez: -42000, s: 4, sp:  700, seed: 24 },
      { name: 'Farpoint Highway',            sx:  62000, sz: -22000, ex:  48000, ez:  -8000, s: 3, sp:  600, seed: 25 },
      { name: 'Central Bypass',              sx:   4400, sz:   -400, ex:   7000, ez: -14000, s: 2, sp:  400, seed: 26 },
      { name: 'West Crossroads',             sx: -35000, sz:   -400, ex: -43000, ez: -10000, s: 3, sp:  700, seed: 27 },
      { name: 'Northmere–Farside Road',      sx:   8000, sz:  55000, ex:  28000, ez:  52000, s: 4, sp:  800, seed: 28 },
      { name: 'Tundra Gate Road',            sx:  -6000, sz:  68000, ex:   8000, ez:  55000, s: 3, sp:  600, seed: 29 },
      { name: 'Coasthaven–Harborview Hwy',   sx: -55000, sz:   2000, ex: -43000, ez: -10000, s: 4, sp:  800, seed: 30 },
    ];

    // ── Regional roads (width 9, villages to towns) ───────────────────────────
    const regional = [
      { name: 'East Brook Loop',          sx:   4400, sz:   -400, ex:  -1800, ez: -10000, s: 2, sp: 300, seed: 41 },
      { name: 'North Haven Link',         sx:  -6000, sz:   3100, ex:  -1800, ez: -10000, s: 2, sp: 300, seed: 42 },
      { name: 'Coppervale Road',          sx:  -8000, sz:  12000, ex:  -4000, ez:  22000, s: 2, sp: 350, seed: 43 },
      { name: 'Millhaven Link',           sx:  14000, sz:   2000, ex:  18000, ez:  18000, s: 2, sp: 300, seed: 44 },
      { name: 'Thornfield Road',          sx:  32000, sz:  -4000, ex:  26000, ez: -18000, s: 2, sp: 320, seed: 45 },
      { name: 'Skyreach Alpine Rd',       sx: -24000, sz:  18000, ex: -28000, ez:  28000, s: 2, sp: 280, seed: 46 },
      { name: 'Dusthaven Track',          sx:  16000, sz: -28000, ex:  22000, ez: -42000, s: 2, sp: 300, seed: 47 },
      { name: 'Coldspring Road',          sx:  -2000, sz:  42000, ex:   8000, ez:  55000, s: 2, sp: 350, seed: 48 },
      { name: 'Amber Fields Track',       sx:  36000, sz:  18000, ex:  42000, ez:   8000, s: 2, sp: 300, seed: 49 },
      { name: 'Brookside Lane',           sx:  -1800, sz: -10000, ex:  -6000, ez:   3100, s: 2, sp: 250, seed: 50 },
      { name: 'Ferndale Road',            sx:  22000, sz:  32000, ex:  12000, ez:  36000, s: 2, sp: 280, seed: 51 },
      { name: 'Old Crossing Track',       sx: -28000, sz:  -4000, ex: -38000, ez:  12000, s: 2, sp: 350, seed: 52 },
      { name: 'Driftwood Coastal Rd',     sx: -52000, sz:   8000, ex: -55000, ez:   2000, s: 2, sp: 300, seed: 53 },
      { name: 'Summit Rest Road',         sx: -32000, sz:  22000, ex: -28000, ez:  28000, s: 2, sp: 250, seed: 54 },
      { name: 'Pale Canyon Desert Rd',    sx:  28000, sz: -55000, ex:  22000, ez: -42000, s: 2, sp: 280, seed: 55 },
      { name: 'Glasswater Path',          sx:  -9000, sz:  28000, ex:  -4000, ez:  22000, s: 2, sp: 250, seed: 56 },
      { name: 'Crosshaven Route',         sx:  10000, sz: -48000, ex:  -8000, ez: -38000, s: 2, sp: 300, seed: 57 },
      { name: 'Ember Rock Road',          sx:  48000, sz:  -8000, ex:  42000, ez:   8000, s: 2, sp: 350, seed: 58 },
      { name: 'Marshwick Track',          sx: -12000, sz:  -6000, ex:  -8000, ez:  12000, s: 2, sp: 260, seed: 59 },
      { name: 'Lowfen Road',              sx: -46000, sz: -18000, ex: -43000, ez: -10000, s: 2, sp: 280, seed: 60 },
      { name: 'North Reach Road',         sx:  28000, sz:  52000, ex:   8000, ez:  55000, s: 2, sp: 350, seed: 61 },
      { name: 'Pinecroft Trail',          sx: -16000, sz:  36000, ex: -18000, ez:  55000, s: 2, sp: 350, seed: 62 },
      { name: 'River Bend Rd',            sx: -18000, sz: -23000, ex:  -8000, ez: -38000, s: 2, sp: 300, seed: 63 },
      { name: 'Westport Road',            sx: -35000, sz:   -400, ex: -22000, ez:   8000, s: 2, sp: 350, seed: 64 },
      { name: 'West Cross Link',          sx: -38000, sz:  12000, ex: -43000, ez: -10000, s: 2, sp: 400, seed: 65 },
      { name: 'Farside Road',             sx:  72000, sz:  12000, ex:  62000, ez: -22000, s: 2, sp: 400, seed: 66 },
      { name: 'Ironpeak Valley Rd',       sx: -28000, sz:  28000, ex: -38000, ez:  28000, s: 2, sp: 280, seed: 67 },
      { name: 'Highgate–Riverton Rd',     sx:  12000, sz:  36000, ex:  -4000, ez:  22000, s: 3, sp: 350, seed: 68 },
      { name: 'Farpoint Desert Rd',       sx:  62000, sz: -22000, ex:  28000, ez: -55000, s: 4, sp: 800, seed: 69 },
      { name: 'Boreal Forest Rd',         sx: -18000, sz:  55000, ex: -16000, ez:  36000, s: 3, sp: 450, seed: 70 },
      // Extra regional links
      { name: 'Shallowfork Road',         sx:  -4000, sz:  15000, ex:  -4000, ez:  22000, s: 2, sp: 250, seed: 71 },
      { name: 'Hillend–Millhaven Rd',     sx:  22000, sz: -12000, ex:  14000, ez:   2000, s: 2, sp: 280, seed: 72 },
      { name: 'Gravel Flat Track',        sx:  -8000, sz: -28000, ex:  -8000, ez: -38000, s: 2, sp: 250, seed: 73 },
      { name: 'Stonegate Rd',             sx:  -4000, sz: -32000, ex:   6000, ez: -25000, s: 2, sp: 280, seed: 74 },
      { name: 'Saltblock Road',           sx:  38000, sz: -68000, ex:  28000, ez: -55000, s: 2, sp: 350, seed: 75 },
      { name: 'Ironwood Forest Road',     sx:  38000, sz:  42000, ex:  22000, ez:  32000, s: 3, sp: 450, seed: 76 },
      { name: 'Splitrock Trail',          sx:  22000, sz:  62000, ex:  28000, ez:  52000, s: 2, sp: 300, seed: 77 },
      { name: 'North Bluff Road',         sx:   4000, sz:  72000, ex:  -6000, ez:  68000, s: 2, sp: 300, seed: 78 },
      { name: 'Pinhead Trail',            sx:  -2000, sz:  32000, ex:  -9000, ez:  28000, s: 2, sp: 250, seed: 79 },
      { name: 'Rocky Notch Road',         sx: -36000, sz:  18000, ex: -38000, ez:  28000, s: 2, sp: 250, seed: 80 },
      { name: 'Scree Path',               sx: -40000, sz:  24000, ex: -38000, ez:  28000, s: 2, sp: 200, seed: 81 },
      { name: 'Highcamp Rd',              sx: -26000, sz:  22000, ex: -24000, ez:  18000, s: 2, sp: 200, seed: 82 },
      { name: 'Boghole Lane',             sx: -32000, sz:  -8000, ex: -28000, ez:  -4000, s: 2, sp: 250, seed: 83 },
      { name: 'Mossback Lane',            sx:  -4800, sz:   6200, ex:  -6000, ez:   3100, s: 1, sp: 200, seed: 84 },
      { name: 'Saddlepoint Track',        sx:   8000, sz:   8000, ex:  14000, ez:   2000, s: 2, sp: 280, seed: 85 },
      { name: 'Greystone Road',           sx: -10000, sz: -12000, ex:  -8000, ez:   0,    s: 2, sp: 280, seed: 86 },
      { name: 'Timberline Road',          sx: -22000, sz:  32000, ex: -16000, ez:  36000, s: 2, sp: 300, seed: 87 },
      { name: 'Snowline Path',            sx: -22000, sz:  44000, ex: -18000, ez:  55000, s: 2, sp: 300, seed: 88 },
      { name: 'Rockfall Trail',           sx: -26000, sz:  44000, ex: -22000, ez:  32000, s: 2, sp: 250, seed: 89 },
      { name: 'Mudflats Track',           sx: -55000, sz: -28000, ex: -46000, ez: -18000, s: 2, sp: 350, seed: 90 },
    ];

    // ── Local streets (width 5, short loops within towns) ─────────────────────
    // Generated as small radial/grid patterns around each town centre
    function townStreets(cx, cz, radius, count, seed) {
      const out = [];
      const rand = rng(seed);
      // Radial spokes
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + rand() * 0.3;
        const r1    = radius * 0.2;
        const r2    = radius * (0.5 + rand() * 0.5);
        out.push({
          name: `Street ${i + 1}`,
          type: 'local',
          width: 5,
          points: [
            { x: Math.round(cx + Math.cos(angle) * r1), z: Math.round(cz + Math.sin(angle) * r1) },
            { x: Math.round(cx + Math.cos(angle) * r2), z: Math.round(cz + Math.sin(angle) * r2) },
          ],
        });
      }
      // One ring road at ~60% radius
      const ring = [];
      const ringN = count * 2;
      for (let i = 0; i <= ringN; i++) {
        const a = (i / ringN) * Math.PI * 2;
        const r = radius * (0.55 + rand() * 0.12);
        ring.push({ x: Math.round(cx + Math.cos(a) * r), z: Math.round(cz + Math.sin(a) * r) });
      }
      out.push({ name: 'Ring Road', type: 'local', width: 6, points: ring });
      return out;
    }

    const localGroups = [
      { cx:    -300, cz:   -500, r: 700, n:  8, seed: 500 }, // Centropolis
      { cx:  -43000, cz: -10000, r: 600, n:  8, seed: 501 }, // Harborview
      { cx:   42000, cz:   8000, r: 600, n:  8, seed: 502 }, // Eastgate
      { cx:    8000, cz:  55000, r: 550, n:  7, seed: 503 }, // Northmere
      { cx:   18000, cz:  18000, r: 420, n:  6, seed: 504 }, // Ridgemont
      { cx:  -22000, cz:   8000, r: 400, n:  6, seed: 505 }, // Clearwater
      { cx:   26000, cz: -18000, r: 380, n:  6, seed: 506 }, // Fort Mesa
      { cx:    6000, cz: -25000, r: 360, n:  5, seed: 507 }, // Southmere
      { cx:  -13000, cz:  21000, r: 340, n:  5, seed: 508 }, // Pine Falls
      { cx:   12000, cz:  36000, r: 320, n:  5, seed: 509 }, // Highgate
      { cx:  -38000, cz:  12000, r: 320, n:  5, seed: 510 }, // West Cross
      { cx:   -8000, cz: -38000, r: 300, n:  5, seed: 511 }, // Dunehollow
      { cx:  -28000, cz:  28000, r: 280, n:  5, seed: 512 }, // Ironpeak
      { cx:   -4000, cz:  22000, r: 280, n:  4, seed: 513 }, // Riverton
      { cx:    4400, cz:   -400, r: 200, n:  4, seed: 514 }, // East Brook
      { cx:   -6000, cz:   3100, r: 180, n:  4, seed: 515 }, // North Haven
      { cx:  -35000, cz:   -400, r: 180, n:  4, seed: 516 }, // Westport
      { cx:   14000, cz:   2000, r: 170, n:  4, seed: 517 }, // Millhaven
      { cx:   32000, cz:  -4000, r: 170, n:  4, seed: 518 }, // Thornfield
      { cx:   -8000, cz:  12000, r: 160, n:  4, seed: 519 }, // Coppervale
      { cx:    7000, cz: -14000, r: 160, n:  4, seed: 520 }, // Lakewood
      { cx:   22000, cz:  32000, r: 150, n:  3, seed: 521 }, // Ferndale
      { cx:  -18000, cz: -23000, r: 150, n:  3, seed: 522 }, // River Bend
      { cx:  -55000, cz:   2000, r: 150, n:  3, seed: 523 }, // Coasthaven
      { cx:  -18000, cz:  55000, r: 140, n:  3, seed: 524 }, // Boreal Crossing
      { cx:   62000, cz: -22000, r: 140, n:  3, seed: 525 }, // Farpoint
    ];

    function rng(seed) {
      let s = seed;
      return function() {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
      };
    }

    const localStreets = [];
    for (const g of localGroups) {
      localStreets.push(...townStreets(g.cx, g.cz, g.r, g.n, g.seed));
    }

    // ── Build DB rows ─────────────────────────────────────────────────────────
    const rows = [
      ...highways.map(r => ({
        name:  r.name, type: 'highway', width: 14,
        points: JSON.stringify(path(r.sx, r.sz, r.ex, r.ez, r.s, r.sp, r.seed)),
        createdAt: now, updatedAt: now,
      })),
      ...regional.map(r => ({
        name:  r.name, type: 'regional', width: 9,
        points: JSON.stringify(path(r.sx, r.sz, r.ex, r.ez, r.s, r.sp, r.seed)),
        createdAt: now, updatedAt: now,
      })),
      ...localStreets.map(r => ({
        name:  r.name, type: 'local', width: r.width,
        points: JSON.stringify(r.points),
        createdAt: now, updatedAt: now,
      })),
    ];

    await queryInterface.bulkInsert('road_paths', rows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('road_paths', null, {});
  },
};
