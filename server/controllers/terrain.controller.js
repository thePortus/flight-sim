'use strict';

// ---------- constants -------------------------------------------------------
const TILE_SIZE  = 4000;    // world units per tile edge (unchanged — keeps streaming intact)
const RESOLUTION = 17;      // vertices per edge (16 × 16 quads, step = 250 u)
const MAX_HEIGHT = 1200;    // maximum elevation in world units
const SEED       = 73.4561; // world seed

// ---------- value-noise helpers ---------------------------------------------

function hash(ix, iy, seed) {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(t) { return t * t * (3 - 2 * t); }

function noise2d(x, y, seed) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix,        fy = y - iy;
  const a = hash(ix,     iy,     seed);
  const b = hash(ix + 1, iy,     seed);
  const c = hash(ix,     iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  const sx = smoothstep(fx), sy = smoothstep(fy);
  return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
}

function fbm(x, y, seed, octaves = 4) {
  let v = 0, amp = 0.5, freq = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    v    += noise2d(x * freq, y * freq, seed + i * 17.3) * amp;
    norm += amp;
    amp  *= 0.5;
    freq *= 2.1;
  }
  return v / norm;
}

// ---------- terrain algorithms ----------------------------------------------

// Domain-warped FBM: warps sample coordinates by low-frequency noise offsets
// before sampling, producing organic ridges that look nothing like tile grids.
function warpedHeight(wx, wz) {
  const ns = 2200; // noise scale: 2200 game units = 1.0 noise unit
  const nx = wx / ns;
  const nz = wz / ns;
  // Low-frequency warp offsets (0.3 scale = very broad distortion)
  const warpX = fbm(nx * 0.3,       nz * 0.3,       SEED + 10, 3) * 0.5 - 0.25;
  const warpZ = fbm(nx * 0.3 + 5.2, nz * 0.3 + 1.3, SEED + 11, 3) * 0.5 - 0.25;
  // High detail FBM sampled at warped coordinates (6 octaves for fine detail)
  return fbm(nx + warpX, nz + warpZ, SEED, 6);
}

// Continental-scale noise: very low frequency, drives ocean vs land distinction.
// 1 noise unit = 18000 game units → features span tens of km.
function continentalNoise(wx, wz) {
  return fbm(wx / 18000, wz / 18000, SEED + 300, 3);
}

// Moisture noise: independent noise channel for biome assignment (wet vs dry).
function moistureNoise(wx, wz) {
  return fbm(wx / 5000, wz / 5000, SEED + 500, 4);
}

// Regional elevation envelope: boosts height in designated mountain/highland
// regions and suppresses it in plains and desert zones.
function elevationEnvelope(wx, wz) {
  // NW mountain range — peaks centred near (-35000, 25000)
  const nwMtn = Math.max(0,
    1 - Math.sqrt((wx + 35000) * (wx + 35000) * 0.6 + (wz - 25000) * (wz - 25000)) / 28000
  );
  // Eastern highlands — broad gentle uplift east of x=15000
  const eHigh = Math.max(0, (wx - 10000) / 70000) * 0.55;
  // Southern plateau — moderate lift south of z=-15000
  const sDes  = Math.max(0, (-wz - 15000) / 90000) * 0.38;
  // Northern ridge — moderate uplift north of z=30000
  const nRidge = Math.max(0, (wz - 30000) / 60000) * 0.45;
  // Baseline raised to 0.30 so even flat plains show rolling hills.
  // Mountain regions reach the full 1.0 envelope for dramatic peaks.
  return Math.min(1, Math.max(0.30, nwMtn * 1.3 + eHigh + sDes + nRidge + 0.30));
}

// ---------- tile generator --------------------------------------------------

function generateTile(tileX, tileZ) {
  const worldX = tileX * TILE_SIZE;
  const worldZ = tileZ * TILE_SIZE;
  const step   = TILE_SIZE / (RESOLUTION - 1);

  // ── Ocean / land decision at tile centre ───────────────────────────────────
  // Tiles where the continental noise is below 0.38 are ocean tiles.
  // Their height is forced to 0 so the sphere-drop from the frontend places
  // the surface exactly at sea level everywhere on the globe.
  // Exception: tiles within 14 000 units of the origin are always land so the
  // starting airport and Centropolis are never submerged regardless of seed.
  const cx       = worldX + TILE_SIZE / 2;
  const cz       = worldZ + TILE_SIZE / 2;
  const contN    = continentalNoise(cx, cz);
  const distFromOrigin = Math.sqrt(cx * cx + cz * cz);
  const isOcean  = contN < 0.38 && distFromOrigin > 22000;
  const isCoast  = !isOcean && contN < 0.44 && distFromOrigin > 18000;

  if (isOcean) {
    // All-zero heights — the frontend sphere-drop places them at sea level.
    const heights = new Array(RESOLUTION * RESOLUTION).fill(0);
    return {
      id: `${tileX}_${tileZ}`, tileX, tileZ, worldX, worldZ,
      size: TILE_SIZE, resolution: RESOLUTION,
      heights, groundCover: 'ocean', trees: [],
    };
  }

  // ── Height array for land tiles ────────────────────────────────────────────
  const heights = [];
  for (let row = 0; row < RESOLUTION; row++) {
    for (let col = 0; col < RESOLUTION; col++) {
      const vx = worldX + col * step;
      const vz = worldZ + row * step;

      // Radial spawn-area mask: keep a flat zone only in the immediate
      // airport vicinity (~1 km), ramp to full elevation by 3.2 km.
      const d    = Math.sqrt(vx * vx + vz * vz) / 2000;
      const spawnMask = Math.max(0, Math.min(1, (d - 0.55) / 1.1));

      const baseH = warpedHeight(vx, vz);
      const env   = elevationEnvelope(vx, vz);

      // Per-vertex coastal blending.  The blend extends ~3 600 world units
      // (0.20 noise units × 18 000 scale) inland from the ocean boundary so
      // land tile edges slope all the way to zero before the ocean begins —
      // no cliff at the tile seam.  Quadratic ramp gives a concave beach.
      const vContN = continentalNoise(vx, vz);
      const vDist  = Math.sqrt(vx * vx + vz * vz);
      let coastMask = 1;
      if (vContN < 0.38 && vDist > 22000) {
        coastMask = 0;                                         // ocean territory
      } else if (vContN < 0.58 && vDist > 18000) {
        const t = Math.max(0, (vContN - 0.38) / 0.20);
        coastMask = t * t;                                     // concave beach ramp
      }

      // Softer exponent (1.15 vs 1.45) boosts mid-range heights so rolling
      // hills are clearly visible; spawn mask² keeps the airport flat.
      const h = Math.pow(baseH, 1.15) * MAX_HEIGHT * env * spawnMask * spawnMask * coastMask;
      heights.push(parseFloat(Math.max(0, h).toFixed(2)));
    }
  }

  // ── Biome / ground cover ───────────────────────────────────────────────────
  // Elevation at tile centre drives the primary biome selection.
  const tileMidH   = warpedHeight(cx, cz);
  const tileEnv    = elevationEnvelope(cx, cz);
  const normH      = Math.pow(tileMidH, 1.45) * tileEnv; // [0, ~1]
  const moisture   = moistureNoise(cx, cz);

  let groundCover;
  if      (normH   > 0.68)                     groundCover = 'alpine';
  else if (normH   > 0.42 && moisture > 0.52)  groundCover = 'forest';
  else if (normH   > 0.20 && moisture > 0.56)  groundCover = 'farmland';
  else if (normH   < 0.14 && moisture < 0.38)  groundCover = 'arid';
  else if (isCoast)                             groundCover = 'grassland';
  else if (moisture > 0.50)                     groundCover = 'forest';
  else                                          groundCover = 'grassland';

  // ── Tree placement (forest tiles only) ─────────────────────────────────────
  const trees = [];
  if (groundCover === 'forest') {
    for (let i = 0; i < 55; i++) {
      const tx    = worldX + hash(i, 0, SEED + 200) * TILE_SIZE;
      const tz    = worldZ + hash(i, 1, SEED + 201) * TILE_SIZE;
      const scale = 0.6 + hash(i, 2, SEED + 202) * 0.9;
      trees.push({
        x:     parseFloat(tx.toFixed(1)),
        z:     parseFloat(tz.toFixed(1)),
        scale: parseFloat(scale.toFixed(2)),
      });
    }
  }

  return {
    id: `${tileX}_${tileZ}`, tileX, tileZ, worldX, worldZ,
    size: TILE_SIZE, resolution: RESOLUTION,
    heights, groundCover, trees,
  };
}

// ---------- overview handler ------------------------------------------------

const OVERVIEW_RANGE = 68000;  // ±68 000 u — covers the full seeded world

/**
 * GET /api/terrain/overview
 * Returns {worldX, worldZ, groundCover} for every tile in the world extent.
 * No heights are returned — this is designed to be fast and light for map rendering.
 * The response is ~100 KB JSON and can be cached client-side indefinitely.
 */
exports.getOverview = (req, res) => {
  const firstTile = Math.floor(-OVERVIEW_RANGE / TILE_SIZE);
  const lastTile  = Math.ceil( OVERVIEW_RANGE / TILE_SIZE);

  const tiles = [];
  for (let tx = firstTile; tx <= lastTile; tx++) {
    for (let tz = firstTile; tz <= lastTile; tz++) {
      const worldX = tx * TILE_SIZE;
      const worldZ = tz * TILE_SIZE;
      const cx = worldX + TILE_SIZE / 2;
      const cz = worldZ + TILE_SIZE / 2;

      const contN          = continentalNoise(cx, cz);
      const distFromOrigin = Math.sqrt(cx * cx + cz * cz);
      const isOcean        = contN < 0.38 && distFromOrigin > 22000;
      const isCoast        = !isOcean && contN < 0.44 && distFromOrigin > 18000;

      if (isOcean) {
        tiles.push({ worldX, worldZ, groundCover: 'ocean' });
        continue;
      }

      const tileMidH = warpedHeight(cx, cz);
      const tileEnv  = elevationEnvelope(cx, cz);
      const normH    = Math.pow(tileMidH, 1.15) * tileEnv;
      const moisture = moistureNoise(cx, cz);

      let groundCover;
      if      (normH   > 0.68)                     groundCover = 'alpine';
      else if (normH   > 0.42 && moisture > 0.52)  groundCover = 'forest';
      else if (normH   > 0.20 && moisture > 0.56)  groundCover = 'farmland';
      else if (normH   < 0.14 && moisture < 0.38)  groundCover = 'arid';
      else if (isCoast)                             groundCover = 'grassland';
      else if (moisture > 0.50)                     groundCover = 'forest';
      else                                          groundCover = 'grassland';

      tiles.push({ worldX, worldZ, groundCover });
    }
  }

  res.json(tiles);
};

// ---------- route handler ---------------------------------------------------

exports.TILE_SIZE = TILE_SIZE;

/**
 * GET /api/terrain?minX=&maxX=&minZ=&maxZ=
 * Returns an array of terrain tiles whose bounding box overlaps the query area.
 */
exports.getTiles = (req, res) => {
  const minX = parseFloat(req.query.minX);
  const maxX = parseFloat(req.query.maxX);
  const minZ = parseFloat(req.query.minZ);
  const maxZ = parseFloat(req.query.maxZ);

  if ([minX, maxX, minZ, maxZ].some(isNaN)) {
    return res.status(400).json({ message: 'minX, maxX, minZ, maxZ are required' });
  }

  const firstTileX = Math.floor(minX / TILE_SIZE);
  const lastTileX  = Math.floor(maxX / TILE_SIZE);
  const firstTileZ = Math.floor(minZ / TILE_SIZE);
  const lastTileZ  = Math.floor(maxZ / TILE_SIZE);

  const tiles = [];
  for (let tx = firstTileX; tx <= lastTileX; tx++) {
    for (let tz = firstTileZ; tz <= lastTileZ; tz++) {
      tiles.push(generateTile(tx, tz));
    }
  }

  res.json(tiles);
};
