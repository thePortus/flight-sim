module.exports = app => {
  require('./user.routes')(app);
  require('./profile.routes')(app);
  require('./structure.routes')(app);
  require('./hydrography.routes')(app);
  require('./weather.routes')(app);
  require('./planes.routes')(app);
  require('./terrain.routes')(app);
  require('./roads.routes')(app);
  require('./airport.routes')(app);
  require('./towns.routes')(app);
};