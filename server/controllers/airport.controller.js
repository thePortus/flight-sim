'use strict';

// Airports are placed at terrain-sampled elevations so the runway mesh
// sits flush with the ground. Central Airport (XCTR) is in the flat home
// valley; the others are in adjacent tiles 3–4 km out.
// heading = degrees clockwise from world +Z axis (0 = N-S, 90 = E-W).

const AIRPORTS = [
  {
    id: 1, name: 'Central International Airport', code: 'XCTR',
    x: 0, z: 0, elevation: 0,
    runways: [
      // Main N-S runway — player spawns at south threshold (z ≈ -900)
      { id: 'XCTR-18', heading:  0, length: 2000, width: 45, x:   0, z:    0, elevation: 0 },
      // Cross-wind E-W runway; offset north so it doesn't visually overlap 18/36
      { id: 'XCTR-09', heading: 90, length: 1600, width: 40, x:   0, z:  600, elevation: 0 },
    ],
  },
  {
    id: 2, name: 'North Valley Airstrip', code: 'XNVA',
    x: 0, z: 3800, elevation: 16,
    runways: [
      { id: 'XNVA-18', heading:   0, length: 1400, width: 35, x: 0, z: 3800, elevation: 16 },
    ],
  },
  {
    id: 3, name: 'East Mesa Airport', code: 'XEMS',
    x: 3800, z: 0, elevation: 16,
    runways: [
      { id: 'XEMS-09', heading:  90, length: 1600, width: 40, x: 3800, z: 0, elevation: 16 },
    ],
  },
  {
    id: 4, name: 'Southgate Field', code: 'XSGF',
    x: 1200, z: -3000, elevation: 21,
    runways: [
      { id: 'XSGF-18', heading: 0, length: 1200, width: 30, x: 1200, z: -3000, elevation: 21 },
    ],
  },
  {
    id: 5, name: 'Westside Airfield', code: 'XWSA',
    x: -2800, z: -1200, elevation: 8,
    runways: [
      { id: 'XWSA-09', heading: 90, length: 1500, width: 35, x: -2800, z: -1200, elevation: 8 },
    ],
  },
];

exports.getAirports = (req, res) => {
  res.json(AIRPORTS);
};
