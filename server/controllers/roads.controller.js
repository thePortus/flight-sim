'use strict';

// Grid spacing (world units) for each road class
const HW_SPACING    = 3000;  // highways — major arteries
const LOCAL_SPACING = 1000;  // local roads — secondary grid

// Deterministic stable segment ID from road class, direction, and grid coords
function segId(type, direction, ix, iz) {
  return `${type}_${direction}_${ix}_${iz}`;
}

/**
 * GET /api/roads?minX=&maxX=&minZ=&maxZ=
 *
 * Returns road segments whose bounding box overlaps the query area.
 * Segments always run between consecutive grid intersections so the same
 * segment gets the same ID regardless of which bbox was used to fetch it.
 */
exports.getRoads = (req, res) => {
  const minX = parseFloat(req.query.minX);
  const maxX = parseFloat(req.query.maxX);
  const minZ = parseFloat(req.query.minZ);
  const maxZ = parseFloat(req.query.maxZ);

  if ([minX, maxX, minZ, maxZ].some(isNaN)) {
    return res.status(400).json({ message: 'minX, maxX, minZ, maxZ are required' });
  }

  const roads = [];

  // ── Highways N-S (constant X, segments between highway Z intersections) ──
  const firstHX = Math.ceil(minX  / HW_SPACING);
  const lastHX  = Math.floor(maxX / HW_SPACING);
  for (let ix = firstHX; ix <= lastHX; ix++) {
    const firstSeg = Math.floor(minZ / HW_SPACING);
    const lastSeg  = Math.floor(maxZ / HW_SPACING);
    for (let iz = firstSeg; iz <= lastSeg; iz++) {
      roads.push({
        id:    segId('hw', 'ns', ix, iz),
        x1:    ix * HW_SPACING,
        z1:    iz * HW_SPACING,
        x2:    ix * HW_SPACING,
        z2:    (iz + 1) * HW_SPACING,
        width: 12,
        type:  'highway',
      });
    }
  }

  // ── Highways E-W (constant Z, segments between highway X intersections) ──
  const firstHZ = Math.ceil(minZ  / HW_SPACING);
  const lastHZ  = Math.floor(maxZ / HW_SPACING);
  for (let iz = firstHZ; iz <= lastHZ; iz++) {
    const firstSeg = Math.floor(minX / HW_SPACING);
    const lastSeg  = Math.floor(maxX / HW_SPACING);
    for (let ix = firstSeg; ix <= lastSeg; ix++) {
      roads.push({
        id:    segId('hw', 'ew', iz, ix),
        x1:    ix * HW_SPACING,
        z1:    iz * HW_SPACING,
        x2:    (ix + 1) * HW_SPACING,
        z2:    iz * HW_SPACING,
        width: 12,
        type:  'highway',
      });
    }
  }

  // ── Local roads N-S (skip positions that are already highways) ───────────
  const hwSteps   = HW_SPACING / LOCAL_SPACING;
  const firstLX   = Math.ceil(minX  / LOCAL_SPACING);
  const lastLX    = Math.floor(maxX / LOCAL_SPACING);
  for (let ix = firstLX; ix <= lastLX; ix++) {
    if (ix % hwSteps === 0) continue; // this column is a highway
    const firstSeg = Math.floor(minZ / LOCAL_SPACING);
    const lastSeg  = Math.floor(maxZ / LOCAL_SPACING);
    for (let iz = firstSeg; iz <= lastSeg; iz++) {
      roads.push({
        id:    segId('local', 'ns', ix, iz),
        x1:    ix * LOCAL_SPACING,
        z1:    iz * LOCAL_SPACING,
        x2:    ix * LOCAL_SPACING,
        z2:    (iz + 1) * LOCAL_SPACING,
        width: 5,
        type:  'local',
      });
    }
  }

  // ── Local roads E-W (skip positions that are already highways) ───────────
  const firstLZ = Math.ceil(minZ  / LOCAL_SPACING);
  const lastLZ  = Math.floor(maxZ / LOCAL_SPACING);
  for (let iz = firstLZ; iz <= lastLZ; iz++) {
    if (iz % hwSteps === 0) continue; // this row is a highway
    const firstSeg = Math.floor(minX / LOCAL_SPACING);
    const lastSeg  = Math.floor(maxX / LOCAL_SPACING);
    for (let ix = firstSeg; ix <= lastSeg; ix++) {
      roads.push({
        id:    segId('local', 'ew', iz, ix),
        x1:    ix * LOCAL_SPACING,
        z1:    iz * LOCAL_SPACING,
        x2:    (ix + 1) * LOCAL_SPACING,
        z2:    iz * LOCAL_SPACING,
        width: 5,
        type:  'local',
      });
    }
  }

  res.json(roads);
};
