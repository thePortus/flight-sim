const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/structure.controller.js');
  const router     = require('express').Router();

  // GET /api/structures?minX=&maxX=&minZ=&maxZ=
  router.get('/',    limitRate, controller.findInArea);
  router.get('/all', limitRate, controller.findAll);

  app.use('/api/structures', router);
};
