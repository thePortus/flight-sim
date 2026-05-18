'use strict';

const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/towns.controller');
  const router     = require('express').Router();

  router.get('/', limitRate, controller.getTowns);

  app.use('/api/towns', router);
};
