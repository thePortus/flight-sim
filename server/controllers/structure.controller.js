const db        = require('../models');
const Structure = db.Structure;
const { Op }    = db.Sequelize;

/**
 * GET /api/structures?minX=&maxX=&minZ=&maxZ=
 * Returns all structures whose (x, z) position falls within the given bounding box.
 * All parameters are optional — omitting them returns every structure.
 */
exports.findInArea = (req, res) => {
  const where = {};

  const minX = parseFloat(req.query.minX);
  const maxX = parseFloat(req.query.maxX);
  const minZ = parseFloat(req.query.minZ);
  const maxZ = parseFloat(req.query.maxZ);

  if (!isNaN(minX) && !isNaN(maxX)) where.x = { [Op.between]: [minX, maxX] };
  if (!isNaN(minZ) && !isNaN(maxZ)) where.z = { [Op.between]: [minZ, maxZ] };

  Structure.findAll({ where })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

/** GET /api/structures/all — returns every structure (admin/debug use) */
exports.findAll = (req, res) => {
  Structure.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};
