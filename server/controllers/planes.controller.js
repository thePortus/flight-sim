'use strict';

// ── Cessna 172 Skyhawk ────────────────────────────────────────────────────────
// Coordinate convention (shared with the client's BabylonJS scene):
//   +Z = nose / forward   −Z = tail
//   +Y = up               +X = right wing
// All rotations are Euler angles in radians.
// ─────────────────────────────────────────────────────────────────────────────
const cessna172 = {
  id:   1,
  name: 'Cessna 172 Skyhawk',
  slug: 'cessna-172',
  parts: [

    // ── Fuselage ─────────────────────────────────────────────────────────────

    // Cabin pod (wide, tall — passenger compartment)
    { id: 'cabin', shape: 'box',
      params:   { width: 1.55, height: 1.25, depth: 3.0 },
      position: { x: 0, y: 0.2, z: 1.5 },
      material: { color: '#F2F2F0', texture: 'cessna_body', specular: '#666666' } },

    // Tail boom (slimmer rear fuselage that tapers to the empennage)
    { id: 'tail_boom', shape: 'box',
      params:   { width: 0.85, height: 0.8, depth: 4.8 },
      position: { x: 0, y: -0.1, z: -2.4 },
      material: { color: '#F2F2F0', texture: 'cessna_body', specular: '#666666' } },

    // Engine cowling (tapered cylinder at the nose)
    { id: 'cowling', shape: 'cylinder',
      params:   { height: 1.8, diameterTop: 0.85, diameterBottom: 1.15, tessellation: 12 },
      position: { x: 0, y: -0.1, z: 3.85 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    // ── High wings (strut-braced — the defining Cessna silhouette) ────────────

    { id: 'wing_left', shape: 'box',
      params:   { width: 5.6, height: 0.12, depth: 1.7 },
      position: { x: -3.25, y: 0.55, z: 0.8 },
      material: { color: '#EEEEEC', texture: 'cessna_wing', specular: '#666666' } },

    { id: 'wing_right', shape: 'box',
      params:   { width: 5.6, height: 0.12, depth: 1.7 },
      position: { x:  3.25, y: 0.55, z: 0.8 },
      material: { color: '#EEEEEC', texture: 'cessna_wing', specular: '#666666' } },

    // Wing struts (diagonal braces from fuselage underside to mid-wing)
    { id: 'strut_left', shape: 'box',
      params:   { width: 0.07, height: 1.3, depth: 0.07 },
      position: { x: -2.3, y: -0.1, z: 0.7 },
      rotation: { x: 0, y: 0, z: -0.2 },
      material: { color: '#999999', texture: 'metal', specular: '#BBBBBB' } },

    { id: 'strut_right', shape: 'box',
      params:   { width: 0.07, height: 1.3, depth: 0.07 },
      position: { x:  2.3, y: -0.1, z: 0.7 },
      rotation: { x: 0, y: 0, z:  0.2 },
      material: { color: '#999999', texture: 'metal', specular: '#BBBBBB' } },

    // ── Empennage (tail surfaces) ─────────────────────────────────────────────

    { id: 'h_stab_left', shape: 'box',
      params:   { width: 2.6, height: 0.1, depth: 0.9 },
      position: { x: -1.45, y: 0.05, z: -4.5 },
      material: { color: '#F2F2F0', texture: 'cessna_body', specular: '#666666' } },

    { id: 'h_stab_right', shape: 'box',
      params:   { width: 2.6, height: 0.1, depth: 0.9 },
      position: { x:  1.45, y: 0.05, z: -4.5 },
      material: { color: '#F2F2F0', texture: 'cessna_body', specular: '#666666' } },

    { id: 'v_fin', shape: 'box',
      params:   { width: 0.1, height: 1.8, depth: 1.4 },
      position: { x: 0, y: 0.9, z: -4.2 },
      material: { color: '#F2F2F0', texture: 'cessna_body', specular: '#666666' } },

    // Rudder — coloured to match stripe for visual accent
    { id: 'rudder', shape: 'box',
      params:   { width: 0.1, height: 1.5, depth: 0.55 },
      position: { x: 0, y: 0.75, z: -4.95 },
      material: { color: '#CC3311', specular: '#444444' } },

    // ── Tricycle landing gear ─────────────────────────────────────────────────

    { id: 'gear_leg_left', shape: 'box',
      params:   { width: 0.08, height: 1.1, depth: 0.06 },
      position: { x: -0.72, y: -0.78, z: 0.9 },
      rotation: { x: 0, y: 0, z: 0.12 },
      material: { color: '#888888', specular: '#BBBBBB' } },

    { id: 'gear_leg_right', shape: 'box',
      params:   { width: 0.08, height: 1.1, depth: 0.06 },
      position: { x:  0.72, y: -0.78, z: 0.9 },
      rotation: { x: 0, y: 0, z: -0.12 },
      material: { color: '#888888', specular: '#BBBBBB' } },

    { id: 'wheel_left', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.56, tessellation: 12 },
      position: { x: -0.85, y: -1.32, z: 0.9 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    { id: 'wheel_right', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.56, tessellation: 12 },
      position: { x:  0.85, y: -1.32, z: 0.9 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    { id: 'gear_nose', shape: 'box',
      params:   { width: 0.06, height: 0.8, depth: 0.06 },
      position: { x: 0, y: -0.7, z: 2.7 },
      material: { color: '#888888', specular: '#BBBBBB' } },

    { id: 'wheel_nose', shape: 'cylinder',
      params:   { height: 0.22, diameter: 0.42, tessellation: 10 },
      position: { x: 0, y: -1.1, z: 2.7 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    // ── Propeller ─────────────────────────────────────────────────────────────

    // Two-blade prop as a single cross-shaped box — client rotates this around Z
    { id: 'prop_blade', shape: 'box',
      params:   { width: 0.14, height: 3.4, depth: 0.06 },
      position: { x: 0, y: 0, z: 4.82 },
      material: { color: '#2A2A2A', texture: 'propeller', specular: '#555555' },
      isProp: true },

    // Prop spinner / hub cone
    { id: 'prop_spinner', shape: 'cylinder',
      params:   { height: 0.45, diameterTop: 0.08, diameterBottom: 0.5, tessellation: 10 },
      position: { x: 0, y: 0, z: 4.72 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#DDDDDD' } },

    // ── Glazing (semi-transparent) ────────────────────────────────────────────

    { id: 'window_left', shape: 'box',
      params:   { width: 0.06, height: 0.45, depth: 1.6 },
      position: { x: -0.79, y: 0.35, z: 1.5 },
      material: { color: '#1A3A5C', alpha: 0.45 } },

    { id: 'window_right', shape: 'box',
      params:   { width: 0.06, height: 0.45, depth: 1.6 },
      position: { x:  0.79, y: 0.35, z: 1.5 },
      material: { color: '#1A3A5C', alpha: 0.45 } },

    { id: 'windshield', shape: 'box',
      params:   { width: 1.35, height: 0.5, depth: 0.06 },
      position: { x: 0, y: 0.42, z: 3.02 },
      rotation: { x: -0.35, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.4 } },
  ],
};

// ── Cessna 172 interior (cockpit layer — visible only in first-person view) ─
// Origin is still the plane's local space.  Camera sits at (0, 0.38, 3.2).
// All parts are positioned around that reference point:
//   +Z = forward / panel direction   +Y = up   +X = right
cessna172.cockpitParts = [

  // Instrument panel — tilted slightly toward pilot, filling lower FOV
  { id: 'ck_panel', shape: 'box',
    params:   { width: 1.30, height: 0.38, depth: 0.06 },
    position: { x: 0, y: 0.15, z: 3.65 },
    rotation: { x: -0.18, y: 0, z: 0 },
    material: { color: '#1A1A1A', texture: 'cockpit_panel' } },

  // Glare shield — narrow black strip atop the panel at horizon level
  { id: 'ck_glare', shape: 'box',
    params:   { width: 1.28, height: 0.05, depth: 0.20 },
    position: { x: 0, y: 0.35, z: 3.56 },
    rotation: { x: 0.12, y: 0, z: 0 },
    material: { color: '#0D0D0D' } },

  // Left & right door interior panels
  { id: 'ck_wall_l', shape: 'box',
    params:   { width: 0.04, height: 0.62, depth: 0.88 },
    position: { x: -0.68, y: 0.18, z: 2.95 },
    material: { color: '#B8AFA2', texture: 'cockpit_interior' } },

  { id: 'ck_wall_r', shape: 'box',
    params:   { width: 0.04, height: 0.62, depth: 0.88 },
    position: { x:  0.68, y: 0.18, z: 2.95 },
    material: { color: '#B8AFA2', texture: 'cockpit_interior' } },

  // Ceiling / headliner
  { id: 'ck_ceiling', shape: 'box',
    params:   { width: 1.35, height: 0.04, depth: 0.92 },
    position: { x: 0, y: 0.70, z: 2.90 },
    material: { color: '#C8C0B4', texture: 'cockpit_interior' } },

  // Floor
  { id: 'ck_floor', shape: 'box',
    params:   { width: 1.26, height: 0.04, depth: 0.94 },
    position: { x: 0, y: -0.05, z: 2.90 },
    material: { color: '#2E2E2E', texture: 'cockpit_floor' } },

  // Centre console (between pilot/co-pilot)
  { id: 'ck_console', shape: 'box',
    params:   { width: 0.18, height: 0.28, depth: 0.70 },
    position: { x: 0, y: -0.08, z: 2.88 },
    material: { color: '#252525' } },

  // Throttle quadrant housing
  { id: 'ck_throttle_box', shape: 'box',
    params:   { width: 0.15, height: 0.10, depth: 0.32 },
    position: { x: 0.08, y: 0.08, z: 3.32 },
    material: { color: '#1C1C1C' } },

  // Throttle lever
  { id: 'ck_throttle_lever', shape: 'box',
    params:   { width: 0.04, height: 0.22, depth: 0.04 },
    position: { x: 0.08, y: 0.20, z: 3.24 },
    material: { color: '#111111' } },

  // Pilot yoke shaft (left seat, front of pilot)
  { id: 'ck_yoke_shaft', shape: 'cylinder',
    params:   { height: 0.28, diameter: 0.045, tessellation: 8 },
    position: { x: -0.28, y: 0.08, z: 3.45 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  // Yoke crossbar (U-shape top)
  { id: 'ck_yoke_bar', shape: 'box',
    params:   { width: 0.28, height: 0.04, depth: 0.04 },
    position: { x: -0.28, y: 0.27, z: 3.44 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  // Window frames (visible from inside as dark trim)
  { id: 'ck_frame_l', shape: 'box',
    params:   { width: 0.03, height: 0.40, depth: 0.06 },
    position: { x: -0.74, y: 0.34, z: 3.22 },
    material: { color: '#1A1A1A' } },

  { id: 'ck_frame_r', shape: 'box',
    params:   { width: 0.03, height: 0.40, depth: 0.06 },
    position: { x:  0.74, y: 0.34, z: 3.22 },
    material: { color: '#1A1A1A' } },
];

// ── Beechcraft King Air C90 ───────────────────────────────────────────────────
const kingAirC90 = {
  id:   2,
  name: 'Beechcraft King Air C90',
  slug: 'king-air-c90',
  physics: {
    initialSpeed:    180,
    initialThrottle: 0.55,
    acceleration:    80,
    dragK:           0.10,
    maxSpeed:        500,
    liftK:           0.000185,
    stallSpeed:      155,
    groundOffset:    1.54, // plane-center above ground: main-gear bottom at local y −1.54
    weight:          1.5,  // ~4× heavier than C172; amplifies gravity/lift dynamics
    rotSpeed:        1.0,  // rad/s — heavier twin is less agile than Cessna
    throttleRate:    0.30, // turboprop spools up moderately
    retractableGear: true,
  },
  parts: [
    // ── Fuselage ─────────────────────────────────────────────────────────────
    { id: 'ka_cabin', shape: 'box',
      params:   { width: 1.8, height: 1.8, depth: 7.2 },
      position: { x: 0, y: 0.1, z: -0.2 },
      material: { color: '#EEEFED', texture: 'king_air_body', specular: '#888888' } },

    { id: 'ka_nose', shape: 'cylinder',
      params:   { height: 2.0, diameterTop: 0.4, diameterBottom: 1.6, tessellation: 12 },
      position: { x: 0, y: 0.1, z: 4.2 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#EEEFED', texture: 'king_air_body', specular: '#888888' } },

    // ── Low wings ─────────────────────────────────────────────────────────────
    { id: 'ka_wing_left', shape: 'box',
      params:   { width: 7.8, height: 0.20, depth: 2.4 },
      position: { x: -4.5, y: -0.2, z: 0.0 },
      material: { color: '#E0E0DE', specular: '#666666' } },

    { id: 'ka_wing_right', shape: 'box',
      params:   { width: 7.8, height: 0.20, depth: 2.4 },
      position: { x:  4.5, y: -0.2, z: 0.0 },
      material: { color: '#E0E0DE', specular: '#666666' } },

    // ── Engine nacelles (turboprops) ─────────────────────────────────────────
    { id: 'ka_nacelle_left', shape: 'cylinder',
      params:   { height: 2.4, diameterTop: 0.42, diameterBottom: 0.52, tessellation: 12 },
      position: { x: -2.8, y: -0.2, z: 0.8 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    { id: 'ka_nacelle_right', shape: 'cylinder',
      params:   { height: 2.4, diameterTop: 0.42, diameterBottom: 0.52, tessellation: 12 },
      position: { x:  2.8, y: -0.2, z: 0.8 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    // ── Props (one per engine) ────────────────────────────────────────────────
    { id: 'ka_prop_left', shape: 'box',
      params:   { width: 0.14, height: 3.2, depth: 0.07 },
      position: { x: -2.8, y: -0.2, z: 1.98 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },

    { id: 'ka_prop_right', shape: 'box',
      params:   { width: 0.14, height: 3.2, depth: 0.07 },
      position: { x:  2.8, y: -0.2, z: 1.98 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },

    // ── T-tail ────────────────────────────────────────────────────────────────
    { id: 'ka_vfin', shape: 'box',
      params:   { width: 0.14, height: 2.4, depth: 1.8 },
      position: { x: 0, y: 1.3, z: -5.0 },
      material: { color: '#EEEFED', texture: 'king_air_body', specular: '#888888' } },

    { id: 'ka_hstab_left', shape: 'box',
      params:   { width: 3.2, height: 0.13, depth: 1.1 },
      position: { x: -1.7, y: 2.5, z: -5.0 },
      material: { color: '#E0E0DE', specular: '#666666' } },

    { id: 'ka_hstab_right', shape: 'box',
      params:   { width: 3.2, height: 0.13, depth: 1.1 },
      position: { x:  1.7, y: 2.5, z: -5.0 },
      material: { color: '#E0E0DE', specular: '#666666' } },

    // ── Landing gear ──────────────────────────────────────────────────────────
    { id: 'ka_gear_left', shape: 'cylinder',
      params:   { height: 0.65, diameter: 0.10, tessellation: 8 },
      position: { x: -0.9, y: -0.95, z: 0.5 },
      material: { color: '#333333' } },

    { id: 'ka_gear_right', shape: 'cylinder',
      params:   { height: 0.65, diameter: 0.10, tessellation: 8 },
      position: { x:  0.9, y: -0.95, z: 0.5 },
      material: { color: '#333333' } },

    { id: 'ka_wheel_left', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.40, tessellation: 12 },
      position: { x: -0.9, y: -1.34, z: 0.5 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#111111', texture: 'tire' } },

    { id: 'ka_wheel_right', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.40, tessellation: 12 },
      position: { x:  0.9, y: -1.34, z: 0.5 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#111111', texture: 'tire' } },

    { id: 'ka_nose_strut', shape: 'cylinder',
      params:   { height: 0.55, diameter: 0.09, tessellation: 8 },
      position: { x: 0, y: -0.90, z: 3.2 },
      material: { color: '#333333' } },

    { id: 'ka_nose_wheel', shape: 'cylinder',
      params:   { height: 0.14, diameter: 0.32, tessellation: 12 },
      position: { x: 0, y: -1.23, z: 3.2 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#111111', texture: 'tire' } },
  ],
  cockpitParts: [
    // ── Cockpit interior (King Air C90 — wider dual-crew layout) ─────────────

    // Floor
    { id: 'ka_ck_floor', shape: 'box',
      params:   { width: 1.60, height: 0.04, depth: 1.60 },
      position: { x: 0, y: -0.42, z: 3.30 },
      material: { color: '#2B2B2B', texture: 'cockpit_floor' } },

    // Left/right sidewalls
    { id: 'ka_ck_wall_l', shape: 'box',
      params:   { width: 0.04, height: 0.80, depth: 1.60 },
      position: { x: -0.78, y: 0.00, z: 3.30 },
      material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

    { id: 'ka_ck_wall_r', shape: 'box',
      params:   { width: 0.04, height: 0.80, depth: 1.60 },
      position: { x:  0.78, y: 0.00, z: 3.30 },
      material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

    // Overhead panel
    { id: 'ka_ck_ceiling', shape: 'box',
      params:   { width: 1.60, height: 0.04, depth: 1.60 },
      position: { x: 0, y: 0.42, z: 3.30 },
      material: { color: '#1A1A1A', texture: 'cockpit_interior' } },

    // Main instrument panel (wider)
    { id: 'ka_ck_panel', shape: 'box',
      params:   { width: 1.52, height: 0.60, depth: 0.06 },
      position: { x: 0, y: 0.12, z: 3.80 },
      material: { color: '#1A1A1A', texture: 'cockpit_panel' } },

    // Centre console
    { id: 'ka_ck_console', shape: 'box',
      params:   { width: 0.22, height: 0.30, depth: 0.80 },
      position: { x: 0, y: -0.10, z: 3.30 },
      material: { color: '#252525' } },

    // Dual throttle levers
    { id: 'ka_ck_throttle_l', shape: 'box',
      params:   { width: 0.04, height: 0.22, depth: 0.04 },
      position: { x: -0.10, y: 0.20, z: 3.20 },
      material: { color: '#111111' } },

    { id: 'ka_ck_throttle_r', shape: 'box',
      params:   { width: 0.04, height: 0.22, depth: 0.04 },
      position: { x:  0.10, y: 0.20, z: 3.20 },
      material: { color: '#111111' } },

    // Pilot yoke (left seat)
    { id: 'ka_ck_yoke_shaft', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.045, tessellation: 8 },
      position: { x: -0.32, y: 0.08, z: 3.52 },
      material: { color: '#3A3A3A', specular: '#888888' } },

    { id: 'ka_ck_yoke_bar', shape: 'box',
      params:   { width: 0.30, height: 0.04, depth: 0.04 },
      position: { x: -0.32, y: 0.27, z: 3.51 },
      material: { color: '#3A3A3A', specular: '#888888' } },

    // Window frames
    { id: 'ka_ck_frame_l', shape: 'box',
      params:   { width: 0.03, height: 0.44, depth: 0.06 },
      position: { x: -0.76, y: 0.32, z: 3.24 },
      material: { color: '#1A1A1A' } },

    { id: 'ka_ck_frame_r', shape: 'box',
      params:   { width: 0.03, height: 0.44, depth: 0.06 },
      position: { x:  0.76, y: 0.32, z: 3.24 },
      material: { color: '#1A1A1A' } },
  ],
};

// ── P-51 Mustang ──────────────────────────────────────────────────────────────
const p51Mustang = {
  id:   3,
  name: 'P-51 Mustang',
  slug: 'p51-mustang',
  physics: {
    initialSpeed:    220,
    initialThrottle: 0.55,
    acceleration:    135,
    dragK:           0.085,
    maxSpeed:        620,
    liftK:           0.000170,
    stallSpeed:      150,
    groundOffset:    1.35, // plane-center above ground: main-gear bottom at local y −1.35
    weight:          0.80,
    rotSpeed:        2.2,  // rad/s — nimble WWII fighter turns quickly
    throttleRate:    0.55, // Merlin responds fast to throttle input
    retractableGear: true,
    cockpitCameraPos: { x: 0, y: 1.0, z: 1.5 },
    // ── Weapons ──────────────────────────────────────────────────────────────
    machineGunsEnabled: true,
    gunPositions: [
      // Local-space positions at the leading edge of each wing; 2 guns per wing
      { x: -2.5, y: 0.08, z: 1.3 },  // left  inner gun
      { x: -5.5, y: 0.06, z: 0.7 },  // left  outer gun
      { x:  2.5, y: 0.08, z: 1.3 },  // right inner gun
      { x:  5.5, y: 0.06, z: 0.7 },  // right outer gun
    ],
  },
  parts: [
    // ── Fuselage ─────────────────────────────────────────────────────────────
    { id: 'p51_body', shape: 'box',
      params:   { width: 1.0, height: 0.88, depth: 9.2 },
      position: { x: 0, y: 0.08, z: -0.6 },
      material: { color: '#C8C8C8', texture: 'p51_body', specular: '#CCCCCC' } },

    { id: 'p51_cowl', shape: 'cylinder',
      params:   { height: 3.2, diameterTop: 0.78, diameterBottom: 1.08, tessellation: 12 },
      position: { x: 0, y: 0.08, z: 5.6 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#DDDDDD' } },

    { id: 'p51_cowl_ring', shape: 'cylinder',
      params:   { height: 0.14, diameterTop: 1.10, diameterBottom: 1.10, tessellation: 12 },
      position: { x: 0, y: 0.08, z: 7.17 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#CCCCCC' } },

    { id: 'p51_tail_cone', shape: 'cylinder',
      params:   { height: 2.2, diameterTop: 0.25, diameterBottom: 0.88, tessellation: 10 },
      position: { x: 0, y: 0.08, z: -5.6 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#CCCCCC' } },

    // ── Bubble canopy ─────────────────────────────────────────────────────────
    { id: 'p51_canopy_base', shape: 'box',
      params:   { width: 0.76, height: 0.22, depth: 1.85 },
      position: { x: 0, y: 0.62, z: 0.5 },
      material: { color: '#888888', texture: 'metal', specular: '#BBBBBB' } },

    { id: 'p51_canopy_glass', shape: 'cylinder',
      params:   { height: 1.55, diameterTop: 0.30, diameterBottom: 0.82, tessellation: 10 },
      position: { x: 0, y: 0.92, z: 0.35 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.30 } },

    { id: 'p51_windscreen', shape: 'box',
      params:   { width: 0.80, height: 0.42, depth: 0.06 },
      position: { x: 0, y: 0.76, z: 1.85 },
      rotation: { x: -0.32, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.38 } },

    // ── Wings (low-mid mount) ──────────────────────────────────────────────────
    { id: 'p51_wing_l_inner', shape: 'box',
      params:   { width: 3.6, height: 0.16, depth: 1.85 },
      position: { x: -2.3, y: 0.0, z: 0.3 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    { id: 'p51_wing_l_outer', shape: 'box',
      params:   { width: 4.0, height: 0.12, depth: 1.40 },
      position: { x: -6.3, y: 0.06, z: -0.10 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    { id: 'p51_wing_r_inner', shape: 'box',
      params:   { width: 3.6, height: 0.16, depth: 1.85 },
      position: { x:  2.3, y: 0.0, z: 0.3 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    { id: 'p51_wing_r_outer', shape: 'box',
      params:   { width: 4.0, height: 0.12, depth: 1.40 },
      position: { x:  6.3, y: 0.06, z: -0.10 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    // ── Belly scoop (Meredith radiator air intake — very distinctive) ──────────
    { id: 'p51_scoop', shape: 'box',
      params:   { width: 0.52, height: 0.30, depth: 1.65 },
      position: { x: 0, y: -0.50, z: 3.4 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    // ── Exhaust stacks (3 per side along cowl) ────────────────────────────────
    { id: 'p51_exh_l1', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 6 },
      position: { x: -0.52, y: 0.10, z: 7.1 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#333333', specular: '#777777' } },
    { id: 'p51_exh_l2', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 6 },
      position: { x: -0.52, y: 0.10, z: 6.7 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#333333', specular: '#777777' } },
    { id: 'p51_exh_l3', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 6 },
      position: { x: -0.52, y: 0.10, z: 6.3 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#333333', specular: '#777777' } },
    { id: 'p51_exh_r1', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 6 },
      position: { x:  0.52, y: 0.10, z: 7.1 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#333333', specular: '#777777' } },
    { id: 'p51_exh_r2', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 6 },
      position: { x:  0.52, y: 0.10, z: 6.7 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#333333', specular: '#777777' } },
    { id: 'p51_exh_r3', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 6 },
      position: { x:  0.52, y: 0.10, z: 6.3 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#333333', specular: '#777777' } },

    // ── Gun barrels (.50 cal — 3 per wing) ────────────────────────────────────
    { id: 'p51_gun_l1', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.055, tessellation: 6 },
      position: { x: -1.5, y: 0.0, z: 1.3 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },
    { id: 'p51_gun_l2', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.055, tessellation: 6 },
      position: { x: -2.8, y: 0.0, z: 1.2 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },
    { id: 'p51_gun_l3', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.055, tessellation: 6 },
      position: { x: -4.2, y: 0.0, z: 1.0 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },
    { id: 'p51_gun_r1', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.055, tessellation: 6 },
      position: { x:  1.5, y: 0.0, z: 1.3 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },
    { id: 'p51_gun_r2', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.055, tessellation: 6 },
      position: { x:  2.8, y: 0.0, z: 1.2 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },
    { id: 'p51_gun_r3', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.055, tessellation: 6 },
      position: { x:  4.2, y: 0.0, z: 1.0 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },

    // ── Tail surfaces ──────────────────────────────────────────────────────────
    { id: 'p51_vstab', shape: 'box',
      params:   { width: 0.12, height: 1.80, depth: 1.60 },
      position: { x: 0, y: 1.0, z: -5.1 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    { id: 'p51_rudder', shape: 'box',
      params:   { width: 0.10, height: 1.45, depth: 0.58 },
      position: { x: 0, y: 0.80, z: -6.05 },
      material: { color: '#B8B8B8', specular: '#888888' } },

    { id: 'p51_hstab_l', shape: 'box',
      params:   { width: 2.8, height: 0.12, depth: 0.95 },
      position: { x: -1.5, y: 0.12, z: -5.1 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    { id: 'p51_hstab_r', shape: 'box',
      params:   { width: 2.8, height: 0.12, depth: 0.95 },
      position: { x:  1.5, y: 0.12, z: -5.1 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    { id: 'p51_elev_l', shape: 'box',
      params:   { width: 2.2, height: 0.09, depth: 0.42 },
      position: { x: -1.4, y: 0.12, z: -5.70 },
      material: { color: '#B8B8B8', specular: '#888888' } },

    { id: 'p51_elev_r', shape: 'box',
      params:   { width: 2.2, height: 0.09, depth: 0.42 },
      position: { x:  1.4, y: 0.12, z: -5.70 },
      material: { color: '#B8B8B8', specular: '#888888' } },

    // ── 4-blade propeller (2 crossed blades, 90° offset) ──────────────────────
    { id: 'p51_prop_a', shape: 'box',
      params:   { width: 0.15, height: 3.90, depth: 0.08 },
      position: { x: 0, y: 0, z: 7.50 },
      material: { color: '#2A2A2A', texture: 'propeller', specular: '#555555' },
      isProp: true },

    { id: 'p51_prop_b', shape: 'box',
      params:   { width: 0.15, height: 3.90, depth: 0.08 },
      position: { x: 0, y: 0, z: 7.54 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#2A2A2A', texture: 'propeller', specular: '#555555' },
      isProp: true },

    { id: 'p51_spinner', shape: 'cylinder',
      params:   { height: 0.55, diameterTop: 0.10, diameterBottom: 0.68, tessellation: 10 },
      position: { x: 0, y: 0.08, z: 7.28 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#FFCC00', texture: 'metal', specular: '#EEEEEE' } },

    // ── Taildragger landing gear ───────────────────────────────────────────────
    { id: 'p51_gear_l', shape: 'box',
      params:   { width: 0.08, height: 1.05, depth: 0.07 },
      position: { x: -0.62, y: -0.60, z: 0.8 },
      rotation: { x: 0, y: 0, z: 0.12 },
      material: { color: '#888888', specular: '#BBBBBB' } },

    { id: 'p51_gear_r', shape: 'box',
      params:   { width: 0.08, height: 1.05, depth: 0.07 },
      position: { x:  0.62, y: -0.60, z: 0.8 },
      rotation: { x: 0, y: 0, z: -0.12 },
      material: { color: '#888888', specular: '#BBBBBB' } },

    { id: 'p51_wheel_l', shape: 'cylinder',
      params:   { height: 0.24, diameter: 0.50, tessellation: 12 },
      position: { x: -0.78, y: -1.10, z: 0.8 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    { id: 'p51_wheel_r', shape: 'cylinder',
      params:   { height: 0.24, diameter: 0.50, tessellation: 12 },
      position: { x:  0.78, y: -1.10, z: 0.8 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    { id: 'p51_tail_strut', shape: 'box',
      params:   { width: 0.06, height: 0.48, depth: 0.05 },
      position: { x: 0, y: -0.50, z: -5.3 },
      material: { color: '#888888', specular: '#BBBBBB' } },

    { id: 'p51_tail_wheel', shape: 'cylinder',
      params:   { height: 0.14, diameter: 0.24, tessellation: 8 },
      position: { x: 0, y: -0.74, z: -5.3 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },
  ],
};
p51Mustang.cockpitParts = [
  // ── P-51 bubble cockpit interior (camera at 0, 1.0, 1.5) ─────────────────
  // Tight single-seat fighter cockpit — very close walls and canopy
  { id: 'p51_ck_floor', shape: 'box',
    params:   { width: 0.70, height: 0.04, depth: 0.80 },
    position: { x: 0, y: 0.62, z: 1.18 },
    material: { color: '#2A2A2A', texture: 'cockpit_floor' } },

  { id: 'p51_ck_wall_l', shape: 'box',
    params:   { width: 0.04, height: 0.44, depth: 0.80 },
    position: { x: -0.37, y: 0.86, z: 1.18 },
    material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

  { id: 'p51_ck_wall_r', shape: 'box',
    params:   { width: 0.04, height: 0.44, depth: 0.80 },
    position: { x:  0.37, y: 0.86, z: 1.18 },
    material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

  // Rear armour-plate bulkhead
  { id: 'p51_ck_back', shape: 'box',
    params:   { width: 0.70, height: 0.44, depth: 0.04 },
    position: { x: 0, y: 0.86, z: 0.58 },
    material: { color: '#1A1A1A' } },

  // Instrument panel (tilted toward pilot)
  { id: 'p51_ck_panel', shape: 'box',
    params:   { width: 0.68, height: 0.40, depth: 0.05 },
    position: { x: 0, y: 0.82, z: 1.96 },
    rotation: { x: -0.22, y: 0, z: 0 },
    material: { color: '#1A1A1A', texture: 'cockpit_panel' } },

  // Glare shield
  { id: 'p51_ck_glare', shape: 'box',
    params:   { width: 0.68, height: 0.06, depth: 0.16 },
    position: { x: 0, y: 1.02, z: 1.88 },
    material: { color: '#0D0D0D' } },

  // Windscreen frame top
  { id: 'p51_ck_wind_frame', shape: 'box',
    params:   { width: 0.74, height: 0.08, depth: 0.05 },
    position: { x: 0, y: 1.08, z: 1.92 },
    material: { color: '#1A1A1A' } },

  // K-14 gunsight (distinctive WWII era)
  { id: 'p51_ck_gunsight', shape: 'cylinder',
    params:   { height: 0.08, diameter: 0.12, tessellation: 8 },
    position: { x: 0, y: 1.06, z: 1.82 },
    material: { color: '#444444', specular: '#AAAAAA' } },

  // Control stick
  { id: 'p51_ck_stick', shape: 'box',
    params:   { width: 0.045, height: 0.30, depth: 0.045 },
    position: { x: 0, y: 0.72, z: 1.45 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  // Throttle lever (left console)
  { id: 'p51_ck_throttle', shape: 'box',
    params:   { width: 0.04, height: 0.26, depth: 0.04 },
    position: { x: -0.27, y: 0.82, z: 1.30 },
    material: { color: '#111111' } },

  // Seat and seatback
  { id: 'p51_ck_seat', shape: 'box',
    params:   { width: 0.52, height: 0.05, depth: 0.42 },
    position: { x: 0, y: 0.60, z: 0.98 },
    material: { color: '#4A3A2A', texture: 'cockpit_interior' } },

  { id: 'p51_ck_seatback', shape: 'box',
    params:   { width: 0.52, height: 0.42, depth: 0.04 },
    position: { x: 0, y: 0.81, z: 0.75 },
    material: { color: '#4A3A2A', texture: 'cockpit_interior' } },

  // Canopy frame strips (left/right)
  { id: 'p51_ck_frame_l', shape: 'box',
    params:   { width: 0.04, height: 0.40, depth: 0.06 },
    position: { x: -0.38, y: 0.98, z: 1.60 },
    material: { color: '#1A1A1A' } },

  { id: 'p51_ck_frame_r', shape: 'box',
    params:   { width: 0.04, height: 0.40, depth: 0.06 },
    position: { x:  0.38, y: 0.98, z: 1.60 },
    material: { color: '#1A1A1A' } },
];

// ── B-17 Flying Fortress ──────────────────────────────────────────────────────
const b17FlyingFortress = {
  id:   4,
  name: 'B-17 Flying Fortress',
  slug: 'b17-flying-fortress',
  physics: {
    initialSpeed:    250,
    initialThrottle: 0.65,
    acceleration:    75,
    dragK:           0.15,
    maxSpeed:        420,
    liftK:           0.000195,
    stallSpeed:      190,
    groundOffset:    2.65, // plane-center above ground: main-gear bottom at local y −2.65
    weight:          2.2,
    rotSpeed:        0.65, // rad/s — heavy bomber is sluggish
    throttleRate:    0.18, // four radial engines spool slowly
    retractableGear: true,
    cockpitCameraPos: { x: 0, y: 1.0, z: 8.0 },
    bombBayEnabled:  true,
    // Bomb positions in plane-local space (under the forward fuselage, y ≈ −1.2)
    // Three sequential positions so repeated drops stagger along the bay
    bombPositions: [
      { x: 0, y: -1.18, z:  3.5 },  // fore
      { x: 0, y: -1.18, z:  1.5 },  // mid
      { x: 0, y: -1.18, z: -0.5 },  // aft
    ],
  },
  parts: [
    // ── Fuselage ─────────────────────────────────────────────────────────────
    { id: 'b17_fuselage', shape: 'box',
      params:   { width: 2.4, height: 2.2, depth: 18.0 },
      position: { x: 0, y: 0, z: 0 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    { id: 'b17_nose_cone', shape: 'cylinder',
      params:   { height: 3.5, diameterTop: 0.30, diameterBottom: 2.4, tessellation: 12 },
      position: { x: 0, y: 0.15, z: 10.75 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.32 } },

    { id: 'b17_tail_cone', shape: 'cylinder',
      params:   { height: 3.2, diameterTop: 0.28, diameterBottom: 2.2, tessellation: 10 },
      position: { x: 0, y: 0.1, z: -10.6 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },

    // Cockpit greenhouse hump (raised section on top of forward fuselage)
    { id: 'b17_cockpit_hump', shape: 'box',
      params:   { width: 1.60, height: 0.60, depth: 3.5 },
      position: { x: 0, y: 1.42, z: 7.25 },
      material: { color: '#3A4218', specular: '#333333' } },

    // ── High-mounted wings ────────────────────────────────────────────────────
    { id: 'b17_wing_l_inner', shape: 'box',
      params:   { width: 6.5, height: 0.24, depth: 3.0 },
      position: { x: -4.25, y: 0.70, z: 1.5 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

    { id: 'b17_wing_l_outer', shape: 'box',
      params:   { width: 6.0, height: 0.18, depth: 2.2 },
      position: { x: -10.25, y: 0.85, z: 0.6 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

    { id: 'b17_wing_r_inner', shape: 'box',
      params:   { width: 6.5, height: 0.24, depth: 3.0 },
      position: { x:  4.25, y: 0.70, z: 1.5 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

    { id: 'b17_wing_r_outer', shape: 'box',
      params:   { width: 6.0, height: 0.18, depth: 2.2 },
      position: { x:  10.25, y: 0.85, z: 0.6 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

    // ── Engine nacelles (4 × R-1820 radial) ──────────────────────────────────
    { id: 'b17_nac_l1', shape: 'cylinder',
      params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
      position: { x: -3.5, y: 0.50, z: 2.2 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    { id: 'b17_nac_l2', shape: 'cylinder',
      params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
      position: { x: -8.5, y: 0.65, z: 1.4 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    { id: 'b17_nac_r1', shape: 'cylinder',
      params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
      position: { x:  3.5, y: 0.50, z: 2.2 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    { id: 'b17_nac_r2', shape: 'cylinder',
      params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
      position: { x:  8.5, y: 0.65, z: 1.4 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    // Nacelle cowl rings
    { id: 'b17_nac_ring_l1', shape: 'cylinder',
      params:   { height: 0.15, diameterTop: 0.72, diameterBottom: 0.72, tessellation: 12 },
      position: { x: -3.5, y: 0.50, z: 3.65 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#666666', texture: 'metal', specular: '#BBBBBB' } },

    { id: 'b17_nac_ring_l2', shape: 'cylinder',
      params:   { height: 0.15, diameterTop: 0.72, diameterBottom: 0.72, tessellation: 12 },
      position: { x: -8.5, y: 0.65, z: 2.85 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#666666', texture: 'metal', specular: '#BBBBBB' } },

    { id: 'b17_nac_ring_r1', shape: 'cylinder',
      params:   { height: 0.15, diameterTop: 0.72, diameterBottom: 0.72, tessellation: 12 },
      position: { x:  3.5, y: 0.50, z: 3.65 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#666666', texture: 'metal', specular: '#BBBBBB' } },

    { id: 'b17_nac_ring_r2', shape: 'cylinder',
      params:   { height: 0.15, diameterTop: 0.72, diameterBottom: 0.72, tessellation: 12 },
      position: { x:  8.5, y: 0.65, z: 2.85 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#666666', texture: 'metal', specular: '#BBBBBB' } },

    // ── Propellers (4 engines × 2 crossed blades each) ────────────────────────
    { id: 'b17_prop_l1a', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x: -3.5, y: 0.50, z: 3.82 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },
    { id: 'b17_prop_l1b', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x: -3.5, y: 0.50, z: 3.86 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },

    { id: 'b17_prop_l2a', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x: -8.5, y: 0.65, z: 3.02 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },
    { id: 'b17_prop_l2b', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x: -8.5, y: 0.65, z: 3.06 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },

    { id: 'b17_prop_r1a', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x:  3.5, y: 0.50, z: 3.82 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },
    { id: 'b17_prop_r1b', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x:  3.5, y: 0.50, z: 3.86 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },

    { id: 'b17_prop_r2a', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x:  8.5, y: 0.65, z: 3.02 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },
    { id: 'b17_prop_r2b', shape: 'box',
      params:   { width: 0.14, height: 3.6, depth: 0.07 },
      position: { x:  8.5, y: 0.65, z: 3.06 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#222222', texture: 'propeller' },
      isProp: true },

    // ── Tail assembly (large single vertical fin) ──────────────────────────────
    { id: 'b17_vstab', shape: 'box',
      params:   { width: 0.18, height: 4.5, depth: 2.8 },
      position: { x: 0, y: 3.1, z: -8.5 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },

    { id: 'b17_rudder', shape: 'box',
      params:   { width: 0.14, height: 3.8, depth: 1.0 },
      position: { x: 0, y: 2.8, z: -9.8 },
      material: { color: '#3A4218', specular: '#333333' } },

    { id: 'b17_hstab_l', shape: 'box',
      params:   { width: 5.5, height: 0.16, depth: 1.8 },
      position: { x: -3.3, y: 0.8, z: -8.5 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

    { id: 'b17_hstab_r', shape: 'box',
      params:   { width: 5.5, height: 0.16, depth: 1.8 },
      position: { x:  3.3, y: 0.8, z: -8.5 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

    { id: 'b17_elev_l', shape: 'box',
      params:   { width: 4.5, height: 0.12, depth: 0.65 },
      position: { x: -3.0, y: 0.8, z: -9.55 },
      material: { color: '#3A4218', specular: '#333333' } },

    { id: 'b17_elev_r', shape: 'box',
      params:   { width: 4.5, height: 0.12, depth: 0.65 },
      position: { x:  3.0, y: 0.8, z: -9.55 },
      material: { color: '#3A4218', specular: '#333333' } },

    // ── Defensive armament ────────────────────────────────────────────────────
    // Dorsal turret (Sperry top turret)
    { id: 'b17_dorsal_base', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.80, tessellation: 12 },
      position: { x: 0, y: 1.40, z: 5.5 },
      material: { color: '#333333', specular: '#555555' } },

    { id: 'b17_dorsal_dome', shape: 'cylinder',
      params:   { height: 0.40, diameterTop: 0.10, diameterBottom: 0.78, tessellation: 12 },
      position: { x: 0, y: 1.72, z: 5.5 },
      material: { color: '#1A3A5C', alpha: 0.35 } },

    // Ball turret (Sperry belly)
    { id: 'b17_ball_turret', shape: 'cylinder',
      params:   { height: 0.55, diameter: 0.90, tessellation: 12 },
      position: { x: 0, y: -1.40, z: 0.5 },
      material: { color: '#222222', specular: '#555555' } },

    // Tail gunner position
    { id: 'b17_tail_gun', shape: 'cylinder',
      params:   { height: 0.40, diameter: 0.70, tessellation: 10 },
      position: { x: 0, y: 0.10, z: -11.8 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.35 } },

    // Chin turret (B-17G)
    { id: 'b17_chin_turret', shape: 'cylinder',
      params:   { height: 0.50, diameter: 0.85, tessellation: 12 },
      position: { x: 0, y: -0.55, z: 9.5 },
      material: { color: '#333333', specular: '#555555' } },

    { id: 'b17_chin_barrel_l', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.07, tessellation: 6 },
      position: { x: -0.22, y: -0.9, z: 9.9 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },

    { id: 'b17_chin_barrel_r', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.07, tessellation: 6 },
      position: { x:  0.22, y: -0.9, z: 9.9 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#222222', specular: '#888888' } },

    // Waist gun windows
    { id: 'b17_waist_l', shape: 'box',
      params:   { width: 0.06, height: 0.55, depth: 0.55 },
      position: { x: -1.22, y: 0.1, z: -3.5 },
      material: { color: '#1A3A5C', alpha: 0.30 } },

    { id: 'b17_waist_r', shape: 'box',
      params:   { width: 0.06, height: 0.55, depth: 0.55 },
      position: { x:  1.22, y: 0.1, z: -3.5 },
      material: { color: '#1A3A5C', alpha: 0.30 } },

    // ── Landing gear ──────────────────────────────────────────────────────────
    { id: 'b17_gear_l', shape: 'box',
      params:   { width: 0.12, height: 1.55, depth: 0.10 },
      position: { x: -1.6, y: -1.45, z: 2.0 },
      rotation: { x: 0, y: 0, z: 0.08 },
      material: { color: '#333333', specular: '#888888' } },

    { id: 'b17_gear_r', shape: 'box',
      params:   { width: 0.12, height: 1.55, depth: 0.10 },
      position: { x:  1.6, y: -1.45, z: 2.0 },
      rotation: { x: 0, y: 0, z: -0.08 },
      material: { color: '#333333', specular: '#888888' } },

    { id: 'b17_wheel_l', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.90, tessellation: 14 },
      position: { x: -2.0, y: -2.20, z: 2.0 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    { id: 'b17_wheel_r', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.90, tessellation: 14 },
      position: { x:  2.0, y: -2.20, z: 2.0 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },

    { id: 'b17_nose_strut', shape: 'box',
      params:   { width: 0.10, height: 1.20, depth: 0.08 },
      position: { x: 0, y: -1.15, z: 7.5 },
      material: { color: '#333333', specular: '#888888' } },

    { id: 'b17_nose_wheel', shape: 'cylinder',
      params:   { height: 0.24, diameter: 0.55, tessellation: 12 },
      position: { x: 0, y: -1.85, z: 7.5 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },
  ],
};
b17FlyingFortress.cockpitParts = [
  // ── B-17 Flying Fortress cockpit (camera at 0, 1.0, 8.0) ─────────────────
  // Pilot (left) + co-pilot (right) side-by-side. Greenhouse windows forward.
  // Side windows reveal the four-engine wing when you look left or right.

  // Floor
  { id: 'b17_ck_floor', shape: 'box',
    params:   { width: 1.80, height: 0.05, depth: 2.20 },
    position: { x: 0, y: 0.38, z: 8.00 },
    material: { color: '#2B2B2B', texture: 'cockpit_floor' } },

  // Lower side walls
  { id: 'b17_ck_wall_l_lo', shape: 'box',
    params:   { width: 0.04, height: 0.50, depth: 2.20 },
    position: { x: -0.88, y: 0.65, z: 8.00 },
    material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

  { id: 'b17_ck_wall_r_lo', shape: 'box',
    params:   { width: 0.04, height: 0.50, depth: 2.20 },
    position: { x:  0.88, y: 0.65, z: 8.00 },
    material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

  // Upper side walls (window frame strips above/below glass)
  { id: 'b17_ck_wall_l_hi', shape: 'box',
    params:   { width: 0.04, height: 0.50, depth: 2.20 },
    position: { x: -0.88, y: 1.28, z: 8.00 },
    material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

  { id: 'b17_ck_wall_r_hi', shape: 'box',
    params:   { width: 0.04, height: 0.50, depth: 2.20 },
    position: { x:  0.88, y: 1.28, z: 8.00 },
    material: { color: '#1E1E1E', texture: 'cockpit_interior' } },

  // Large side windows — very transparent so wings show clearly
  { id: 'b17_ck_win_l1', shape: 'box',
    params:   { width: 0.04, height: 0.70, depth: 1.05 },
    position: { x: -0.87, y: 0.98, z: 8.40 },
    material: { color: '#1A3A5C', alpha: 0.18 } },

  { id: 'b17_ck_win_l2', shape: 'box',
    params:   { width: 0.04, height: 0.70, depth: 1.05 },
    position: { x: -0.87, y: 0.98, z: 7.25 },
    material: { color: '#1A3A5C', alpha: 0.18 } },

  { id: 'b17_ck_win_r1', shape: 'box',
    params:   { width: 0.04, height: 0.70, depth: 1.05 },
    position: { x:  0.87, y: 0.98, z: 8.40 },
    material: { color: '#1A3A5C', alpha: 0.18 } },

  { id: 'b17_ck_win_r2', shape: 'box',
    params:   { width: 0.04, height: 0.70, depth: 1.05 },
    position: { x:  0.87, y: 0.98, z: 7.25 },
    material: { color: '#1A3A5C', alpha: 0.18 } },

  // Ceiling
  { id: 'b17_ck_ceiling', shape: 'box',
    params:   { width: 1.80, height: 0.05, depth: 2.20 },
    position: { x: 0, y: 1.55, z: 8.00 },
    material: { color: '#1A1A1A', texture: 'cockpit_interior' } },

  // Rear bulkhead
  { id: 'b17_ck_rear', shape: 'box',
    params:   { width: 1.80, height: 1.25, depth: 0.05 },
    position: { x: 0, y: 0.90, z: 6.88 },
    material: { color: '#1A1A1A', texture: 'cockpit_interior' } },

  // Front windscreen — left panel, right panel, centre divider
  { id: 'b17_ck_wind_l', shape: 'box',
    params:   { width: 0.62, height: 0.65, depth: 0.05 },
    position: { x: -0.35, y: 1.05, z: 9.12 },
    rotation: { x: -0.18, y: 0, z: 0 },
    material: { color: '#1A3A5C', alpha: 0.22 } },

  { id: 'b17_ck_wind_r', shape: 'box',
    params:   { width: 0.62, height: 0.65, depth: 0.05 },
    position: { x:  0.35, y: 1.05, z: 9.12 },
    rotation: { x: -0.18, y: 0, z: 0 },
    material: { color: '#1A3A5C', alpha: 0.22 } },

  { id: 'b17_ck_wind_center', shape: 'box',
    params:   { width: 0.08, height: 0.65, depth: 0.05 },
    position: { x: 0, y: 1.05, z: 9.12 },
    rotation: { x: -0.18, y: 0, z: 0 },
    material: { color: '#1A1A1A' } },

  // Dual instrument panels (pilot + co-pilot)
  { id: 'b17_ck_panel_l', shape: 'box',
    params:   { width: 0.72, height: 0.58, depth: 0.05 },
    position: { x: -0.33, y: 0.80, z: 9.08 },
    rotation: { x: -0.18, y: 0, z: 0 },
    material: { color: '#1A1A1A', texture: 'cockpit_panel' } },

  { id: 'b17_ck_panel_r', shape: 'box',
    params:   { width: 0.72, height: 0.58, depth: 0.05 },
    position: { x:  0.33, y: 0.80, z: 9.08 },
    rotation: { x: -0.18, y: 0, z: 0 },
    material: { color: '#1A1A1A', texture: 'cockpit_panel' } },

  // Overhead panel
  { id: 'b17_ck_overhead', shape: 'box',
    params:   { width: 1.50, height: 0.08, depth: 1.00 },
    position: { x: 0, y: 1.48, z: 8.65 },
    material: { color: '#1A1A1A', texture: 'cockpit_panel' } },

  // Glare shield
  { id: 'b17_ck_glare', shape: 'box',
    params:   { width: 1.70, height: 0.07, depth: 0.22 },
    position: { x: 0, y: 1.10, z: 9.00 },
    material: { color: '#0D0D0D' } },

  // Centre console with 4 throttle levers (colour-coded per engine)
  { id: 'b17_ck_console', shape: 'box',
    params:   { width: 0.28, height: 0.38, depth: 1.10 },
    position: { x: 0, y: 0.54, z: 8.00 },
    material: { color: '#252525' } },

  { id: 'b17_ck_thr1', shape: 'box',
    params:   { width: 0.04, height: 0.24, depth: 0.04 },
    position: { x: -0.09, y: 0.80, z: 8.38 },
    material: { color: '#CC3311' } },

  { id: 'b17_ck_thr2', shape: 'box',
    params:   { width: 0.04, height: 0.24, depth: 0.04 },
    position: { x: -0.03, y: 0.80, z: 8.38 },
    material: { color: '#117733' } },

  { id: 'b17_ck_thr3', shape: 'box',
    params:   { width: 0.04, height: 0.24, depth: 0.04 },
    position: { x:  0.03, y: 0.80, z: 8.38 },
    material: { color: '#117733' } },

  { id: 'b17_ck_thr4', shape: 'box',
    params:   { width: 0.04, height: 0.24, depth: 0.04 },
    position: { x:  0.09, y: 0.80, z: 8.38 },
    material: { color: '#CC3311' } },

  // Pilot seat + seatback (left)
  { id: 'b17_ck_seat_l', shape: 'box',
    params:   { width: 0.52, height: 0.05, depth: 0.44 },
    position: { x: -0.40, y: 0.40, z: 7.82 },
    material: { color: '#3A3020', texture: 'cockpit_interior' } },

  { id: 'b17_ck_back_l', shape: 'box',
    params:   { width: 0.52, height: 0.54, depth: 0.05 },
    position: { x: -0.40, y: 0.68, z: 7.58 },
    material: { color: '#3A3020', texture: 'cockpit_interior' } },

  // Co-pilot seat + seatback (right)
  { id: 'b17_ck_seat_r', shape: 'box',
    params:   { width: 0.52, height: 0.05, depth: 0.44 },
    position: { x:  0.40, y: 0.40, z: 7.82 },
    material: { color: '#3A3020', texture: 'cockpit_interior' } },

  { id: 'b17_ck_back_r', shape: 'box',
    params:   { width: 0.52, height: 0.54, depth: 0.05 },
    position: { x:  0.40, y: 0.68, z: 7.58 },
    material: { color: '#3A3020', texture: 'cockpit_interior' } },

  // Dual yoke columns
  { id: 'b17_ck_yoke_l_shaft', shape: 'cylinder',
    params:   { height: 0.30, diameter: 0.048, tessellation: 8 },
    position: { x: -0.36, y: 0.58, z: 8.65 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  { id: 'b17_ck_yoke_l_bar', shape: 'box',
    params:   { width: 0.34, height: 0.05, depth: 0.05 },
    position: { x: -0.36, y: 0.78, z: 8.64 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  { id: 'b17_ck_yoke_r_shaft', shape: 'cylinder',
    params:   { height: 0.30, diameter: 0.048, tessellation: 8 },
    position: { x:  0.36, y: 0.58, z: 8.65 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  { id: 'b17_ck_yoke_r_bar', shape: 'box',
    params:   { width: 0.34, height: 0.05, depth: 0.05 },
    position: { x:  0.36, y: 0.78, z: 8.64 },
    material: { color: '#3A3A3A', specular: '#888888' } },

  // ─── VISIBLE WING GEOMETRY (cockpit layer) ───────────────────────────────
  // Exact duplicates of the exterior wing / nacelle parts, but on COCKPIT_LAYER.
  // With the cockpit camera at z=8.0 and wings centred at z≈1.5 (7 units behind),
  // looking left/right at ~45° reveals the full swept wing and four nacelles.
  //
  // Left inner wing
  { id: 'b17_ck_wing_l_inner', shape: 'box',
    params:   { width: 6.5, height: 0.24, depth: 3.0 },
    position: { x: -4.25, y: 0.70, z: 1.5 },
    material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

  // Left outer wing
  { id: 'b17_ck_wing_l_outer', shape: 'box',
    params:   { width: 6.0, height: 0.18, depth: 2.2 },
    position: { x: -10.25, y: 0.85, z: 0.6 },
    material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

  // Left inboard nacelle
  { id: 'b17_ck_nac_l1', shape: 'cylinder',
    params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
    position: { x: -3.5, y: 0.50, z: 2.2 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

  // Left outboard nacelle
  { id: 'b17_ck_nac_l2', shape: 'cylinder',
    params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
    position: { x: -8.5, y: 0.65, z: 1.4 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

  // Left props (spin with propMeshes)
  { id: 'b17_ck_prop_l1a', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x: -3.5, y: 0.50, z: 3.82 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
  { id: 'b17_ck_prop_l1b', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x: -3.5, y: 0.50, z: 3.86 },
    rotation: { x: 0, y: 0, z: Math.PI / 2 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
  { id: 'b17_ck_prop_l2a', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x: -8.5, y: 0.65, z: 3.02 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
  { id: 'b17_ck_prop_l2b', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x: -8.5, y: 0.65, z: 3.06 },
    rotation: { x: 0, y: 0, z: Math.PI / 2 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },

  // Right inner wing
  { id: 'b17_ck_wing_r_inner', shape: 'box',
    params:   { width: 6.5, height: 0.24, depth: 3.0 },
    position: { x:  4.25, y: 0.70, z: 1.5 },
    material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

  // Right outer wing
  { id: 'b17_ck_wing_r_outer', shape: 'box',
    params:   { width: 6.0, height: 0.18, depth: 2.2 },
    position: { x:  10.25, y: 0.85, z: 0.6 },
    material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },

  // Right inboard nacelle
  { id: 'b17_ck_nac_r1', shape: 'cylinder',
    params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
    position: { x:  3.5, y: 0.50, z: 2.2 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

  // Right outboard nacelle
  { id: 'b17_ck_nac_r2', shape: 'cylinder',
    params:   { height: 2.8, diameterTop: 0.45, diameterBottom: 0.70, tessellation: 12 },
    position: { x:  8.5, y: 0.65, z: 1.4 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

  // Right props
  { id: 'b17_ck_prop_r1a', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x:  3.5, y: 0.50, z: 3.82 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
  { id: 'b17_ck_prop_r1b', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x:  3.5, y: 0.50, z: 3.86 },
    rotation: { x: 0, y: 0, z: Math.PI / 2 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
  { id: 'b17_ck_prop_r2a', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x:  8.5, y: 0.65, z: 3.02 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
  { id: 'b17_ck_prop_r2b', shape: 'box',
    params:   { width: 0.14, height: 3.6, depth: 0.07 },
    position: { x:  8.5, y: 0.65, z: 3.06 },
    rotation: { x: 0, y: 0, z: Math.PI / 2 },
    material: { color: '#222222', texture: 'propeller' },
    isProp: true },
];

const allPlanes = [cessna172, kingAirC90, p51Mustang, b17FlyingFortress];

exports.getDefaultPlane = (req, res) => res.json(cessna172);
exports.getPlanes       = (req, res) => res.json(allPlanes.map(p => ({ id: p.id, name: p.name, slug: p.slug })));
exports.getPlaneBySlug  = (req, res) => {
  const plane = allPlanes.find(p => p.slug === req.params.slug);
  if (!plane) return res.status(404).json({ message: 'Plane not found' });
  res.json(plane);
};
