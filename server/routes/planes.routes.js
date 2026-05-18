'use strict';

const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/planes.controller');
  const router     = require('express').Router();

  router.get('/',        limitRate, controller.getPlanes);
  router.get('/default', limitRate, controller.getDefaultPlane);
  router.get('/:slug',   limitRate, controller.getPlaneBySlug);

  app.use('/api/planes', router);
};
