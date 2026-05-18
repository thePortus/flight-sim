'use strict';

// ~132 additional structures spread across the flyable world (±4000 units).
// Organised into distinct settlements so the world feels inhabited from any direction.

const now = new Date();

// Helper: offset a batch of structures to a cluster centre
function cluster(cx, cz, buildings) {
  return buildings.map(b => ({
    name: b.name, type: b.type,
    x: cx + b.x, z: cz + b.z,
    width: b.width, depth: b.depth, height: b.height,
    createdAt: now, updatedAt: now,
  }));
}

const structures = [

  // ── City Centre (≈728 units south-east of spawn — visible on first flight) ──
  ...cluster(200, -700, [
    { name: 'City Tower',           type: 'tower',    x:   0, z:   0, width: 12, depth: 12, height: 80 },
    { name: 'Commerce Plaza',       type: 'building', x:  45, z:  12, width: 30, depth: 25, height: 35 },
    { name: 'Grand Hotel',          type: 'building', x:  85, z: -18, width: 25, depth: 20, height: 50 },
    { name: 'Office Block A',       type: 'building', x: -32, z:  30, width: 20, depth: 18, height: 28 },
    { name: 'Office Block B',       type: 'building', x: -65, z:  10, width: 20, depth: 18, height: 22 },
    { name: 'Market Hall',          type: 'building', x:  22, z:  55, width: 35, depth: 20, height: 12 },
    { name: 'Civic Centre',         type: 'building', x: -42, z: -28, width: 40, depth: 30, height: 15 },
    { name: 'Telecom Tower',        type: 'tower',    x:  75, z:  42, width:  8, depth:  8, height: 65 },
    { name: 'Library',              type: 'building', x: -82, z: -48, width: 28, depth: 22, height: 10 },
    { name: 'Parking Block',        type: 'building', x:  52, z: -58, width: 30, depth: 25, height:  8 },
    { name: 'Shopping Centre',      type: 'building', x: -18, z:  82, width: 45, depth: 30, height: 14 },
    { name: 'Observation Tower',    type: 'tower',    x:-102, z:  62, width:  6, depth:  6, height: 70 },
    { name: 'Medical Centre',       type: 'building', x: 112, z: -38, width: 30, depth: 25, height: 20 },
    { name: 'Bank',                 type: 'building', x: -68, z:  52, width: 18, depth: 18, height: 25 },
    { name: 'City Hall',            type: 'building', x:  -5, z: -82, width: 35, depth: 30, height: 18 },
  ]),

  // ── Industrial Port (east of spawn, heavy-industry hangars) ──────────────
  ...cluster(900, 150, [
    { name: 'Dock Hangar A',        type: 'hangar',   x:   0, z:   0, width: 60, depth: 40, height: 20 },
    { name: 'Dock Hangar B',        type: 'hangar',   x:  72, z:   0, width: 60, depth: 40, height: 20 },
    { name: 'Port Control Tower',   type: 'tower',    x:  22, z:  62, width: 10, depth: 10, height: 45 },
    { name: 'Warehouse 1',          type: 'building', x: -62, z:  42, width: 40, depth: 30, height: 15 },
    { name: 'Warehouse 2',          type: 'building', x: -62, z:  82, width: 40, depth: 30, height: 15 },
    { name: 'Oil Tank Farm',        type: 'building', x:  82, z:  62, width: 20, depth: 20, height: 18 },
    { name: 'Loading Bay',          type: 'hangar',   x:  -5, z: -58, width: 50, depth: 30, height: 14 },
    { name: 'Crane Base',           type: 'tower',    x:  62, z: -38, width:  8, depth:  8, height: 55 },
    { name: 'Generator House',      type: 'building', x: -28, z: -28, width: 15, depth: 12, height: 10 },
    { name: 'Security Post',        type: 'building', x:  32, z:  92, width:  8, depth:  8, height:  6 },
    { name: 'Dry Dock Shed',        type: 'hangar',   x: 142, z:  32, width: 55, depth: 35, height: 18 },
    { name: 'Parts Depot',          type: 'building', x: -82, z: -58, width: 30, depth: 22, height: 12 },
  ]),

  // ── Residential District (south-west, suburban low-rise) ─────────────────
  ...cluster(-650, -850, [
    { name: 'Apartment Block 1',    type: 'building', x:   0, z:   0, width: 18, depth: 15, height: 22 },
    { name: 'Apartment Block 2',    type: 'building', x:  32, z:   0, width: 18, depth: 15, height: 20 },
    { name: 'Apartment Block 3',    type: 'building', x:  64, z:   0, width: 18, depth: 15, height: 25 },
    { name: 'Community Hall',       type: 'building', x:  32, z:  42, width: 25, depth: 20, height:  8 },
    { name: 'Corner Shop',          type: 'building', x: -22, z:  32, width: 12, depth: 10, height:  6 },
    { name: 'School',               type: 'building', x:  82, z:  32, width: 35, depth: 25, height: 10 },
    { name: 'Church Tower',         type: 'tower',    x: -42, z: -18, width:  8, depth:  8, height: 30 },
    { name: 'Row Houses A',         type: 'building', x: -62, z:  42, width: 40, depth: 12, height:  8 },
    { name: 'Row Houses B',         type: 'building', x: -62, z:  62, width: 40, depth: 12, height:  8 },
    { name: 'Park Pavilion',        type: 'building', x:  32, z: -48, width: 15, depth: 12, height:  5 },
    { name: 'Fire Station',         type: 'building', x: 102, z: -28, width: 20, depth: 18, height: 10 },
    { name: 'Police Station',       type: 'building', x: 102, z:  12, width: 18, depth: 15, height: 10 },
    { name: 'Townhouses A',         type: 'building', x: 132, z:  32, width: 30, depth: 12, height:  9 },
    { name: 'Townhouses B',         type: 'building', x: -92, z: -28, width: 30, depth: 12, height:  9 },
    { name: 'Supermarket',          type: 'building', x:   5, z:  82, width: 40, depth: 30, height: 10 },
  ]),

  // ── Northern Town (north of spawn, small market town) ─────────────────────
  ...cluster(400, 1500, [
    { name: 'Town Hall',            type: 'building', x:   0, z:   0, width: 22, depth: 18, height: 14 },
    { name: 'North Bell Tower',     type: 'tower',    x:  32, z:   0, width:  7, depth:  7, height: 38 },
    { name: 'Inn',                  type: 'building', x: -32, z:  22, width: 16, depth: 14, height: 10 },
    { name: 'Bakery',               type: 'building', x:  52, z:  22, width: 10, depth:  8, height:  6 },
    { name: 'Blacksmith',           type: 'building', x: -52, z:   0, width: 12, depth: 10, height:  7 },
    { name: 'General Store',        type: 'building', x:   0, z: -32, width: 14, depth: 12, height:  7 },
    { name: 'Farmhouse A',          type: 'building', x:  82, z:  42, width: 14, depth: 12, height:  6 },
    { name: 'Barn A',               type: 'hangar',   x: 102, z:  42, width: 20, depth: 15, height: 10 },
    { name: 'Farmhouse B',          type: 'building', x: -82, z:  42, width: 14, depth: 12, height:  6 },
    { name: 'Windmill Base',        type: 'tower',    x:-102, z: -12, width:  8, depth:  8, height: 20 },
    { name: 'Workshop',             type: 'building', x:  62, z: -28, width: 18, depth: 14, height:  8 },
    { name: 'Storage',              type: 'hangar',   x: -62, z: -28, width: 22, depth: 16, height:  8 },
  ]),

  // ── Western Mining Settlement ──────────────────────────────────────────────
  ...cluster(-1800, 250, [
    { name: 'Mine Office',          type: 'building', x:   0, z:   0, width: 15, depth: 12, height:  8 },
    { name: 'Mine Headframe',       type: 'tower',    x:  28, z:  12, width:  7, depth:  7, height: 32 },
    { name: 'Processing Plant',     type: 'hangar',   x: -32, z:  42, width: 50, depth: 35, height: 16 },
    { name: 'Bunkhouse',            type: 'building', x:  62, z: -18, width: 18, depth: 12, height:  6 },
    { name: 'Tool Shed',            type: 'hangar',   x: -62, z: -12, width: 20, depth: 15, height:  8 },
    { name: 'Ranch House',          type: 'building', x:  82, z:  32, width: 15, depth: 12, height:  6 },
    { name: 'Ranch Barn',           type: 'hangar',   x: 108, z:  32, width: 25, depth: 18, height:  9 },
    { name: 'Watchtower',           type: 'tower',    x: -82, z:  52, width:  5, depth:  5, height: 22 },
    { name: 'Stable',               type: 'hangar',   x:  42, z:  62, width: 22, depth: 16, height:  8 },
    { name: 'Grain Silo',           type: 'tower',    x: -42, z: -38, width:  6, depth:  6, height: 28 },
  ]),

  // ── Eastern Tech Complex ───────────────────────────────────────────────────
  ...cluster(2200, -350, [
    { name: 'Research Tower',       type: 'tower',    x:   0, z:   0, width: 10, depth: 10, height: 55 },
    { name: 'Lab Block A',          type: 'building', x:  42, z:   0, width: 30, depth: 25, height: 20 },
    { name: 'Lab Block B',          type: 'building', x:  42, z:  38, width: 30, depth: 25, height: 20 },
    { name: 'Data Centre',          type: 'building', x: -42, z:  22, width: 35, depth: 30, height: 15 },
    { name: 'Antenna Tower',        type: 'tower',    x: -52, z: -18, width:  6, depth:  6, height: 60 },
    { name: 'Cooling Plant',        type: 'building', x:  82, z: -18, width: 25, depth: 20, height: 14 },
    { name: 'Test Hangar',          type: 'hangar',   x: -72, z: -38, width: 45, depth: 30, height: 16 },
    { name: 'Staff Housing A',      type: 'building', x: 112, z:  22, width: 20, depth: 16, height: 12 },
    { name: 'Staff Housing B',      type: 'building', x: 112, z:  48, width: 20, depth: 16, height: 12 },
    { name: 'Test Pad',             type: 'hangar',   x:-112, z:  32, width: 40, depth: 40, height: 18 },
    { name: 'Guard Tower',          type: 'tower',    x:  82, z:  62, width:  5, depth:  5, height: 25 },
    { name: 'Conference Centre',    type: 'building', x:  -5, z:  62, width: 28, depth: 22, height: 16 },
  ]),

  // ── Southern Outpost (military/remote) ────────────────────────────────────
  ...cluster(100, -2500, [
    { name: 'Outpost HQ',           type: 'building', x:   0, z:   0, width: 20, depth: 18, height: 12 },
    { name: 'Comm Tower',           type: 'tower',    x:  32, z:  12, width:  6, depth:  6, height: 45 },
    { name: 'Radar Dome',           type: 'building', x: -32, z:  12, width: 12, depth: 12, height: 18 },
    { name: 'Barracks A',           type: 'building', x:  62, z: -18, width: 25, depth: 12, height:  7 },
    { name: 'Barracks B',           type: 'building', x:  62, z:   8, width: 25, depth: 12, height:  7 },
    { name: 'Vehicle Bay',          type: 'hangar',   x: -62, z: -18, width: 35, depth: 25, height: 12 },
    { name: 'Fuel Store',           type: 'building', x: -18, z: -38, width: 15, depth: 12, height:  8 },
    { name: 'Watch Tower',          type: 'tower',    x:  82, z:  42, width:  5, depth:  5, height: 30 },
  ]),

  // ── Far Northern Arctic Base ───────────────────────────────────────────────
  ...cluster(-500, 3000, [
    { name: 'Arctic Station',       type: 'building', x:   0, z:   0, width: 22, depth: 18, height: 10 },
    { name: 'Signal Tower',         type: 'tower',    x:  38, z:   0, width:  6, depth:  6, height: 40 },
    { name: 'Supply Hangar',        type: 'hangar',   x: -42, z:  32, width: 40, depth: 28, height: 14 },
    { name: 'Cold Store',           type: 'building', x:  52, z:  32, width: 18, depth: 15, height:  8 },
    { name: 'Generator Block',      type: 'building', x: -28, z: -28, width: 14, depth: 12, height:  8 },
    { name: 'Runway Tower',         type: 'tower',    x: -62, z:  -5, width:  5, depth:  5, height: 22 },
    { name: 'Crew Quarters',        type: 'building', x:  72, z: -18, width: 20, depth: 16, height:  7 },
    { name: 'Weather Station',      type: 'tower',    x:   0, z:  62, width:  6, depth:  6, height: 18 },
  ]),

  // ── Eastern Ranch / Farm Complex ──────────────────────────────────────────
  ...cluster(1800, 2200, [
    { name: 'Farmhouse',            type: 'building', x:   0, z:   0, width: 14, depth: 12, height:  6 },
    { name: 'Main Barn',            type: 'hangar',   x:  32, z:   0, width: 28, depth: 20, height: 11 },
    { name: 'Silo A',               type: 'tower',    x:  68, z:   0, width:  6, depth:  6, height: 22 },
    { name: 'Silo B',               type: 'tower',    x:  78, z:   0, width:  6, depth:  6, height: 22 },
    { name: 'Equipment Shed',       type: 'hangar',   x: -32, z:  28, width: 25, depth: 18, height:  8 },
    { name: 'Farmhouse 2',          type: 'building', x:  82, z:  42, width: 14, depth: 12, height:  6 },
    { name: 'Barn 2',               type: 'hangar',   x: 118, z:  42, width: 28, depth: 20, height: 11 },
    { name: 'Pump House',           type: 'building', x: -52, z: -18, width: 10, depth:  8, height:  6 },
    { name: 'Irrigation Tower',     type: 'tower',    x: -12, z:  52, width:  5, depth:  5, height: 16 },
    { name: 'Farmworker Cottage',   type: 'building', x: -72, z:  32, width: 12, depth: 10, height:  5 },
  ]),

  // ── Mountain Station (north-west) ─────────────────────────────────────────
  ...cluster(-2800, -750, [
    { name: 'Summit Post',          type: 'building', x:   0, z:   0, width: 12, depth: 10, height:  8 },
    { name: 'High Tower',           type: 'tower',    x:  22, z:   0, width:  6, depth:  6, height: 48 },
    { name: 'Cable Car Shed',       type: 'hangar',   x: -32, z:  22, width: 22, depth: 18, height: 10 },
    { name: 'Observation Post',     type: 'tower',    x:  52, z: -15, width:  5, depth:  5, height: 30 },
    { name: 'Refuge Hut',           type: 'building', x: -42, z: -18, width: 10, depth:  8, height:  5 },
    { name: 'Long-Range Radar',     type: 'tower',    x:  -5, z:  48, width:  7, depth:  7, height: 38 },
  ]),

  // ── Coastal Marina (far east) ─────────────────────────────────────────────
  ...cluster(3100, 800, [
    { name: 'Marina Office',        type: 'building', x:   0, z:   0, width: 18, depth: 14, height: 10 },
    { name: 'Lighthouse',           type: 'tower',    x:  32, z: -22, width:  8, depth:  8, height: 55 },
    { name: 'Marina Hangar A',      type: 'hangar',   x: -52, z:   0, width: 50, depth: 35, height: 14 },
    { name: 'Marina Hangar B',      type: 'hangar',   x: -52, z:  48, width: 50, depth: 35, height: 14 },
    { name: 'Coastal Hotel',        type: 'building', x:  62, z:  22, width: 28, depth: 22, height: 30 },
    { name: 'Dive Shop',            type: 'building', x:  72, z: -15, width: 12, depth: 10, height:  6 },
    { name: 'Boat House A',         type: 'hangar',   x:  42, z: -52, width: 22, depth: 18, height:  8 },
    { name: 'Boat House B',         type: 'hangar',   x:  72, z: -52, width: 22, depth: 18, height:  8 },
    { name: 'Beach Bar',            type: 'building', x: -12, z: -52, width: 14, depth: 10, height:  5 },
    { name: 'Coastal Watchtower',   type: 'tower',    x: -82, z: -28, width:  5, depth:  5, height: 35 },
    { name: 'Storage Depot',        type: 'building', x: -92, z:  58, width: 30, depth: 22, height:  9 },
    { name: 'Fuel Dock',            type: 'building', x: 102, z:  12, width: 15, depth: 12, height:  8 },
  ]),

  // ── Standalone landmarks scattered across the flyable world ───────────────
  { name: 'Desert Tower',         type: 'tower',    x:  1000, z: -1500, width:  6, depth:  6, height: 42, createdAt: now, updatedAt: now },
  { name: 'Prairie Barn',         type: 'hangar',   x: -1200, z:  1800, width: 25, depth: 18, height: 10, createdAt: now, updatedAt: now },
  { name: 'Power Station',        type: 'building', x:   600, z:  2800, width: 30, depth: 25, height: 20, createdAt: now, updatedAt: now },
  { name: 'Relay Tower A',        type: 'tower',    x: -1600, z: -1800, width:  5, depth:  5, height: 35, createdAt: now, updatedAt: now },
  { name: 'Relay Tower B',        type: 'tower',    x:  1600, z:  1600, width:  5, depth:  5, height: 35, createdAt: now, updatedAt: now },
  { name: 'Relay Tower C',        type: 'tower',    x: -2500, z:  1800, width:  5, depth:  5, height: 35, createdAt: now, updatedAt: now },
  { name: 'Relay Tower D',        type: 'tower',    x:  2500, z: -2000, width:  5, depth:  5, height: 35, createdAt: now, updatedAt: now },
  { name: 'Remote Cabin',         type: 'building', x: -3000, z:  2500, width: 10, depth:  9, height:  5, createdAt: now, updatedAt: now },
  { name: 'Hilltop Shrine',       type: 'building', x:  3500, z: -1500, width:  8, depth:  8, height:  6, createdAt: now, updatedAt: now },
  { name: 'Canyon Outpost',       type: 'building', x: -2200, z: -2200, width: 12, depth: 10, height:  7, createdAt: now, updatedAt: now },
  { name: 'Old Lighthouse',       type: 'tower',    x: -3500, z:  -500, width:  7, depth:  7, height: 45, createdAt: now, updatedAt: now },
  { name: 'Forest Cabin',         type: 'building', x:  2800, z:  3000, width: 10, depth:  9, height:  5, createdAt: now, updatedAt: now },
];

module.exports = {
  up:   async qi => qi.bulkInsert('structures', structures, {}),
  down: async qi => qi.bulkDelete('structures', { name: structures.map(s => s.name) }, {}),
};
