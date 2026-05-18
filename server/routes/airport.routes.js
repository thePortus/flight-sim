'use strict';

const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/airport.controller');
  const router     = require('express').Router();

  router.get('/', limitRate, controller.getAirports);

  app.use('/api/airports', router);
};
