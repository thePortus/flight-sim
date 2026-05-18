const db           = require('../models');
const Hydrography  = db.Hydrography;
const { Op }       = db.Sequelize;

/**
 * GET /api/hydrography?minX=&maxX=&minZ=&maxZ=
 * Returns water features whose centre (x, z) falls within the bounding box.
 * Omitting all params returns every feature.
 */
exports.findInArea = (req, res) => {
  const where = {};

  const minX = parseFloat(req.query.minX);
  const maxX = parseFloat(req.query.maxX);
  const minZ = parseFloat(req.query.minZ);
  const maxZ = parseFloat(req.query.maxZ);

  if (!isNaN(minX) && !isNaN(maxX)) where.x = { [Op.between]: [minX, maxX] };
  if (!isNaN(minZ) && !isNaN(maxZ)) where.z = { [Op.between]: [minZ, maxZ] };

  Hydrography.findAll({ where })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Hydrography.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};
