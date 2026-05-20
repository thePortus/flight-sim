'use strict';

const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/terrain.controller');
  const router     = require('express').Router();

  // GET /api/terrain/overview — lightweight biome map for the full world extent
  router.get('/overview', controller.getOverview);

  // GET /api/terrain?minX=&maxX=&minZ=&maxZ=
  // Returns terrain tiles (heightmap + ground cover + tree positions) for the given bbox
  router.get('/', limitRate, controller.getTiles);

  app.use('/terrain', router);
};
