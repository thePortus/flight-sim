'use strict';

// ---------- constants -------------------------------------------------------
const TILE_SIZE  = 4000;    // world units per tile edge
const RESOLUTION = 17;      // vertices per edge (16 × 16 quads, step = 250 u)
const MAX_HEIGHT = 300;     // maximum elevation in world units
const SEED       = 73.4561; // world seed (change to regenerate the world)

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

// ---------- tile generator --------------------------------------------------

function generateTile(tileX, tileZ) {
  const worldX = tileX * TILE_SIZE;
  const worldZ = tileZ * TILE_SIZE;
  const step   = TILE_SIZE / (RESOLUTION - 1);

  // Height array — row-major (row = Z outer, col = X inner).
  // Matches BabylonJS CreateGround vertex layout so heights[row*R+col]
  // maps directly to the vertex at that grid position.
  const heights = [];
  for (let row = 0; row < RESOLUTION; row++) {
    for (let col = 0; col < RESOLUTION; col++) {
      const vx = (worldX + col * step) / 2000; // noise space (1.0 unit = 2000 game units)
      const vz = (worldZ + row * step) / 2000;
      // Flat "home valley" near origin — rises smoothly from 2 000 to 5 000 game units out
      const d    = Math.sqrt(vx * vx + vz * vz);
      const mask = Math.max(0, Math.min(1, (d - 1.0) / 1.5));
      // Power curve: keeps plains flat, amplifies peaks for dramatic mountains
      const h    = Math.pow(fbm(vx, vz, SEED), 1.5) * MAX_HEIGHT * mask * mask;
      heights.push(parseFloat(h.toFixed(2)));
    }
  }

  // Ground cover — coarser noise at the tile centre decides the biome
  const cx     = (worldX + TILE_SIZE / 2) / 6000;
  const cz     = (worldZ + TILE_SIZE / 2) / 6000;
  const cNoise = fbm(cx, cz, SEED + 100, 3);
  let groundCover;
  if      (cNoise < 0.28) groundCover = 'arid';
  else if (cNoise < 0.46) groundCover = 'farmland';
  else if (cNoise < 0.68) groundCover = 'grassland';
  else                    groundCover = 'forest';

  // Tree positions — deterministic, only for forest tiles
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
    id:         `${tileX}_${tileZ}`,
    tileX,
    tileZ,
    worldX,
    worldZ,
    size:       TILE_SIZE,
    resolution: RESOLUTION,
    heights,
    groundCover,
    trees,
  };
}

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
