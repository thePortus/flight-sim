'use strict';

const { RoadPath } = require('../models');
const { Op }       = require('sequelize');

/**
 * GET /api/roads?minX=&maxX=&minZ=&maxZ=
 *
 * Loads road paths from the DB, filters to those whose bounding box overlaps
 * the query area, then breaks each polyline into straight segments using the
 * same {id, x1, z1, x2, z2, width, type} shape the frontend already expects.
 * Short segments (≤ 1000 u) produce naturally curved-looking roads from altitude.
 */
exports.getRoads = async (req, res) => {
  const minX = parseFloat(req.query.minX);
  const maxX = parseFloat(req.query.maxX);
  const minZ = parseFloat(req.query.minZ);
  const maxZ = parseFloat(req.query.maxZ);

  if ([minX, maxX, minZ, maxZ].some(isNaN)) {
    return res.status(400).json({ message: 'minX, maxX, minZ, maxZ are required' });
  }

  try {
    // Fetch all paths; filter in JS (JSON columns can't be range-queried easily)
    const paths = await RoadPath.findAll();

    const segments = [];
    for (const path of paths) {
      const pts = path.points;
      if (!pts || pts.length < 2) continue;

      // Quick AABB test: skip paths entirely outside the query bbox
      let pMinX = Infinity, pMaxX = -Infinity, pMinZ = Infinity, pMaxZ = -Infinity;
      for (const p of pts) {
        if (p.x < pMinX) pMinX = p.x;
        if (p.x > pMaxX) pMaxX = p.x;
        if (p.z < pMinZ) pMinZ = p.z;
        if (p.z > pMaxZ) pMaxZ = p.z;
      }
      if (pMaxX < minX || pMinX > maxX || pMaxZ < minZ || pMinZ > maxZ) continue;

      const roadType = path.type === 'highway' ? 'highway' : 'local';
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        // Skip segments completely outside bbox
        if (Math.max(a.x, b.x) < minX || Math.min(a.x, b.x) > maxX) continue;
        if (Math.max(a.z, b.z) < minZ || Math.min(a.z, b.z) > maxZ) continue;
        segments.push({
          id:    `${path.id}_${i}`,
          x1: a.x, z1: a.z,
          x2: b.x, z2: b.z,
          width: path.width,
          type:  roadType,
        });
      }
    }

    res.json(segments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
