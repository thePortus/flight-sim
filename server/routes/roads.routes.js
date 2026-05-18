'use strict';

const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/roads.controller');
  const router     = require('express').Router();

  // GET /api/roads?minX=&maxX=&minZ=&maxZ=
  // Returns road segments (highway and local) overlapping the given bbox
  router.get('/', limitRate, controller.getRoads);

  app.use('/api/roads', router);
};
