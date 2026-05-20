'use strict';

// heading = degrees clockwise from world +Z axis (0 = N-S, 90 = E-W)
const AIRPORTS = [
  // ── International (2) ──────────────────────────────────────────────────────
  {
    id: 1, name: 'Central International Airport', code: 'XCTR',
    x: 0, z: 0, elevation: 0, type: 'international',
    runways: [
      { id: 'XCTR-18', heading:  0, length: 2000, width: 45, x:   0, z:    0, elevation: 0 },
      { id: 'XCTR-09', heading: 90, length: 1600, width: 40, x:   0, z:  600, elevation: 0 },
    ],
  },
  {
    id: 2, name: 'Harborview International', code: 'XHBR',
    x: -43500, z: -10500, elevation: 4, type: 'international',
    runways: [
      { id: 'XHBR-27', heading: 270, length: 2200, width: 50, x: -43500, z: -10500, elevation: 4 },
      { id: 'XHBR-18', heading:   0, length: 1800, width: 45, x: -43000, z: -11200, elevation: 4 },
    ],
  },
  // ── Regional (6) ───────────────────────────────────────────────────────────
  {
    id: 3, name: 'Eastgate Regional Airport', code: 'XEGT',
    x: 42500, z: 8500, elevation: 18, type: 'regional',
    runways: [
      { id: 'XEGT-09', heading: 90, length: 1800, width: 42, x: 42500, z: 8500, elevation: 18 },
    ],
  },
  {
    id: 4, name: 'Northmere Municipal Airport', code: 'XNMU',
    x: 8500, z: 55500, elevation: 22, type: 'regional',
    runways: [
      { id: 'XNMU-18', heading: 0, length: 1600, width: 38, x: 8500, z: 55500, elevation: 22 },
    ],
  },
  {
    id: 5, name: 'Ridgemont Valley Airport', code: 'XRDG',
    x: 18500, z: 18500, elevation: 35, type: 'regional',
    runways: [
      { id: 'XRDG-09', heading: 90, length: 1500, width: 36, x: 18500, z: 18500, elevation: 35 },
    ],
  },
  {
    id: 6, name: 'Fort Mesa Airport', code: 'XFMS',
    x: 26500, z: -18500, elevation: 28, type: 'regional',
    runways: [
      { id: 'XFMS-18', heading: 0, length: 1400, width: 35, x: 26500, z: -18500, elevation: 28 },
    ],
  },
  {
    id: 7, name: 'Southmere Field', code: 'XSMF',
    x: 6500, z: -25500, elevation: 20, type: 'regional',
    runways: [
      { id: 'XSMF-27', heading: 270, length: 1400, width: 34, x: 6500, z: -25500, elevation: 20 },
    ],
  },
  {
    id: 8, name: 'Pine Falls Airstrip', code: 'XPFS',
    x: -13500, z: 21500, elevation: 42, type: 'regional',
    runways: [
      { id: 'XPFS-36', heading: 0, length: 1300, width: 32, x: -13500, z: 21500, elevation: 42 },
    ],
  },
  // ── Airstrips (12) ─────────────────────────────────────────────────────────
  {
    id: 9, name: 'Mountain Ridge Airstrip', code: 'XMTR',
    x: -28500, z: 22500, elevation: 85, type: 'airstrip',
    runways: [
      { id: 'XMTR-09', heading: 90, length: 1100, width: 28, x: -28500, z: 22500, elevation: 85 },
    ],
  },
  {
    id: 10, name: 'Desert Cross Strip', code: 'XDCS',
    x: 22500, z: -42500, elevation: 12, type: 'airstrip',
    runways: [
      { id: 'XDCS-18', heading: 0, length: 1000, width: 25, x: 22500, z: -42500, elevation: 12 },
    ],
  },
  {
    id: 11, name: 'West Cross Airfield', code: 'XWCR',
    x: -38500, z: 12500, elevation: 22, type: 'airstrip',
    runways: [
      { id: 'XWCR-27', heading: 270, length: 1000, width: 26, x: -38500, z: 12500, elevation: 22 },
    ],
  },
  {
    id: 12, name: 'Highgate Strip', code: 'XHGT',
    x: 12500, z: 36500, elevation: 30, type: 'airstrip',
    runways: [
      { id: 'XHGT-18', heading: 0, length: 900, width: 24, x: 12500, z: 36500, elevation: 30 },
    ],
  },
  {
    id: 13, name: 'Dunehollow Landing', code: 'XDHL',
    x: -8500, z: -38500, elevation: 8, type: 'airstrip',
    runways: [
      { id: 'XDHL-09', heading: 90, length: 900, width: 22, x: -8500, z: -38500, elevation: 8 },
    ],
  },
  {
    id: 14, name: 'Ironpeak Strip', code: 'XIRP',
    x: -28000, z: 28500, elevation: 110, type: 'airstrip',
    runways: [
      { id: 'XIRP-18', heading: 0, length: 850, width: 22, x: -28000, z: 28500, elevation: 110 },
    ],
  },
  {
    id: 15, name: 'Boreal Crossing Aerodrome', code: 'XBRC',
    x: -18500, z: 55500, elevation: 18, type: 'airstrip',
    runways: [
      { id: 'XBRC-27', heading: 270, length: 1000, width: 24, x: -18500, z: 55500, elevation: 18 },
    ],
  },
  {
    id: 16, name: 'Farpoint Strip', code: 'XFPT',
    x: 62500, z: -22500, elevation: 25, type: 'airstrip',
    runways: [
      { id: 'XFPT-18', heading: 0, length: 850, width: 22, x: 62500, z: -22500, elevation: 25 },
    ],
  },
  {
    id: 17, name: 'Sandbrook Field', code: 'XSBK',
    x: 22500, z: -42000, elevation: 10, type: 'airstrip',
    runways: [
      { id: 'XSBK-09', heading: 90, length: 900, width: 22, x: 22500, z: -42000, elevation: 10 },
    ],
  },
  {
    id: 18, name: 'Tundra Gate Strip', code: 'XTDR',
    x: -6500, z: 68500, elevation: 14, type: 'airstrip',
    runways: [
      { id: 'XTDR-18', heading: 0, length: 800, width: 20, x: -6500, z: 68500, elevation: 14 },
    ],
  },
  {
    id: 19, name: 'Pale Canyon Airfield', code: 'XPLC',
    x: 28500, z: -55500, elevation: 16, type: 'airstrip',
    runways: [
      { id: 'XPLC-27', heading: 270, length: 800, width: 20, x: 28500, z: -55500, elevation: 16 },
    ],
  },
  {
    id: 20, name: 'Coasthaven Seaplane Base', code: 'XCSH',
    x: -55500, z: 2500, elevation: 2, type: 'airstrip',
    runways: [
      { id: 'XCSH-09', heading: 90, length: 1000, width: 28, x: -55500, z: 2500, elevation: 2 },
    ],
  },
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const airportRows = AIRPORTS.map(a => ({
      id: a.id, name: a.name, code: a.code,
      x: a.x, z: a.z, elevation: a.elevation, type: a.type,
      createdAt: now, updatedAt: now,
    }));
    await queryInterface.bulkInsert('airports', airportRows);

    const runwayRows = [];
    for (const a of AIRPORTS) {
      for (const rw of a.runways) {
        runwayRows.push({
          id: rw.id, airportId: a.id,
          heading: rw.heading, length: rw.length, width: rw.width,
          x: rw.x, z: rw.z, elevation: rw.elevation,
          createdAt: now, updatedAt: now,
        });
      }
    }
    await queryInterface.bulkInsert('runways', runwayRows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('runways', null, {});
    await queryInterface.bulkDelete('airports', null, {});
  },
};
