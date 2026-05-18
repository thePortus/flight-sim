'use strict';

// Fictional towns distributed across the game world.
// Coordinates are world-space (x, z); y is terrain-height at that location.
// Placed near, but not on top of, the five airports so the map feels inhabited.

const TOWNS = [
  { id: 1,  name: 'Centerville',  x:  -300, z:  -500 },
  { id: 2,  name: 'North Haven',  x:  -600, z:  3100 },
  { id: 3,  name: 'East Brook',   x:  4400, z:  -400 },
  { id: 4,  name: 'Southmere',    x:   600, z: -2500 },
  { id: 5,  name: 'Westport',     x: -3500, z:  -400 },
  { id: 6,  name: 'Ridgemont',    x:  1800, z:  1800 },
  { id: 7,  name: 'Pine Falls',   x: -1300, z:  2100 },
  { id: 8,  name: 'Lakewood',     x:   700, z: -1400 },
  { id: 9,  name: 'Fort Mesa',    x:  2600, z: -1900 },
  { id: 10, name: 'River Bend',   x: -1800, z: -2300 },
  { id: 11, name: 'Clearwater',   x: -2200, z:  1000 },
  { id: 12, name: 'Highgate',     x:  1200, z:  3600 },
];

exports.getTowns = (req, res) => {
  res.json(TOWNS);
};
