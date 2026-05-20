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
    // ══════════════════════════════════════════════════════════════════════════
    // P-51D MUSTANG — ~120-part high-fidelity geometry
    // +Z = nose, -Z = tail, +Y = up, +X = right wing.  Scale ≈ 0.67 m / unit
    // (real wingspan 11.28 m ≈ 16.8 model units; length 9.83 m ≈ 14.7 units)
    // ══════════════════════════════════════════════════════════════════════════

    // ── FUSELAGE – 6 smooth cylinder sections + detail parts ─────────────────
    // S1 – spinner-fairing ring that blends propeller hub into the cowling
    { id: 'p51_fuse_s1', shape: 'cylinder',
      params:   { height: 0.50, diameterTop: 0.72, diameterBottom: 0.92, tessellation: 24 },
      position: { x: 0, y: 0.08, z: 7.00 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#DDDDDD' } },

    // S2 – Merlin V-12 engine cowling (uniform oval cross-section, no sharp edges)
    { id: 'p51_fuse_s2', shape: 'cylinder',
      params:   { height: 4.00, diameterTop: 0.92, diameterBottom: 1.04, tessellation: 24 },
      position: { x: 0, y: 0.08, z: 5.00 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C8C8C8', texture: 'p51_body', specular: '#DDDDDD' } },

    // S3 – firewall / wing-root zone (widest fuselage cross-section)
    { id: 'p51_fuse_s3', shape: 'cylinder',
      params:   { height: 4.00, diameterTop: 1.04, diameterBottom: 1.00, tessellation: 24 },
      position: { x: 0, y: 0.08, z: 1.00 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C8C8C8', texture: 'p51_body', specular: '#CCCCCC' } },

    // S4 – aft cockpit / radio bay (taper begins)
    { id: 'p51_fuse_s4', shape: 'cylinder',
      params:   { height: 3.50, diameterTop: 1.00, diameterBottom: 0.78, tessellation: 24 },
      position: { x: 0, y: 0.08, z: -2.25 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C6C6C6', texture: 'p51_body', specular: '#CCCCCC' } },

    // S5 – pronounced tail taper
    { id: 'p51_fuse_s5', shape: 'cylinder',
      params:   { height: 2.00, diameterTop: 0.78, diameterBottom: 0.48, tessellation: 24 },
      position: { x: 0, y: 0.08, z: -5.00 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#C2C2C2', texture: 'p51_body', specular: '#CCCCCC' } },

    // S6 – final tail cone to near-point
    { id: 'p51_fuse_s6', shape: 'cylinder',
      params:   { height: 1.00, diameterTop: 0.48, diameterBottom: 0.14, tessellation: 20 },
      position: { x: 0, y: 0.08, z: -6.50 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#BEBEBE', texture: 'p51_body', specular: '#CCCCCC' } },

    // Engine topline hump (Merlin sits slightly above the fuselage centre-line)
    { id: 'p51_cowl_dorsal', shape: 'box',
      params:   { width: 0.54, height: 0.14, depth: 3.20 },
      position: { x: 0, y: 0.60, z: 5.20 },
      material: { color: '#BEBEBE', texture: 'p51_body', specular: '#CCCCCC' } },

    // Carburetor air-intake scoop (visible hump on top of cowl – very distinctive)
    { id: 'p51_carb_scoop', shape: 'box',
      params:   { width: 0.22, height: 0.22, depth: 1.00 },
      position: { x: 0, y: 0.76, z: 6.20 },
      material: { color: '#999999', texture: 'metal', specular: '#BBBBBB' } },
    { id: 'p51_carb_inlet', shape: 'cylinder',
      params:   { height: 0.18, diameterTop: 0.22, diameterBottom: 0.12, tessellation: 10 },
      position: { x: 0, y: 0.76, z: 6.72 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    // Cowl-flap band (aft of cowling, adjustable cooling exit)
    { id: 'p51_cowl_flaps', shape: 'cylinder',
      params:   { height: 0.20, diameter: 1.06, tessellation: 24 },
      position: { x: 0, y: 0.08, z: 3.90 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#AAAAAA', texture: 'metal', specular: '#CCCCCC' } },

    // Dorsal spine ridge (raised keel from cockpit to vertical fin)
    { id: 'p51_dorsal_spine', shape: 'box',
      params:   { width: 0.20, height: 0.16, depth: 4.80 },
      position: { x: 0, y: 0.60, z: -2.40 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#CCCCCC' } },

    // ── MEREDITH EFFECT RADIATOR BELLY SCOOP (most iconic P-51 feature) ───────
    // Inlet lip fairing
    { id: 'p51_scoop_lip', shape: 'cylinder',
      params:   { height: 0.12, diameterTop: 0.70, diameterBottom: 0.50, tessellation: 14 },
      position: { x: 0, y: -0.48, z: 2.82 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#777777', texture: 'metal', specular: '#AAAAAA' } },
    // Main duct body
    { id: 'p51_scoop_body', shape: 'box',
      params:   { width: 0.62, height: 0.38, depth: 1.90 },
      position: { x: 0, y: -0.54, z: 1.72 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },
    // Adjustable exhaust outlet
    { id: 'p51_scoop_outlet', shape: 'box',
      params:   { width: 0.52, height: 0.22, depth: 0.40 },
      position: { x: 0, y: -0.58, z: 0.60 },
      material: { color: '#666666', texture: 'metal', specular: '#888888' } },
    // Scoop lower corners (rounded fillets on duct sides)
    { id: 'p51_scoop_fillet_l', shape: 'cylinder',
      params:   { height: 1.90, diameter: 0.14, tessellation: 10 },
      position: { x: -0.26, y: -0.54, z: 1.72 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },
    { id: 'p51_scoop_fillet_r', shape: 'cylinder',
      params:   { height: 1.90, diameter: 0.14, tessellation: 10 },
      position: { x:  0.26, y: -0.54, z: 1.72 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },

    // Oil-cooler inlet scoops (left & right of lower cowl)
    { id: 'p51_oil_l', shape: 'box',
      params:   { width: 0.16, height: 0.16, depth: 0.28 },
      position: { x: -0.22, y: -0.36, z: 6.60 },
      material: { color: '#777777', texture: 'metal', specular: '#999999' } },
    { id: 'p51_oil_r', shape: 'box',
      params:   { width: 0.16, height: 0.16, depth: 0.28 },
      position: { x:  0.22, y: -0.36, z: 6.60 },
      material: { color: '#777777', texture: 'metal', specular: '#999999' } },

    // ── BUBBLE CANOPY – 9 parts ───────────────────────────────────────────────
    // Seat rail / base frame
    { id: 'p51_canopy_base', shape: 'box',
      params:   { width: 0.84, height: 0.14, depth: 2.10 },
      position: { x: 0, y: 0.58, z: 0.55 },
      material: { color: '#888888', texture: 'metal', specular: '#BBBBBB' } },
    // Windscreen – thick armoured glass panel
    { id: 'p51_windscreen', shape: 'box',
      params:   { width: 0.80, height: 0.44, depth: 0.07 },
      position: { x: 0, y: 0.76, z: 1.86 },
      rotation: { x: -0.30, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.38 } },
    // Side windscreen panes
    { id: 'p51_wind_l', shape: 'box',
      params:   { width: 0.06, height: 0.38, depth: 0.36 },
      position: { x: -0.41, y: 0.74, z: 1.68 },
      rotation: { x: -0.20, y: 0.38, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.32 } },
    { id: 'p51_wind_r', shape: 'box',
      params:   { width: 0.06, height: 0.38, depth: 0.36 },
      position: { x:  0.41, y: 0.74, z: 1.68 },
      rotation: { x: -0.20, y: -0.38, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.32 } },
    // Bubble dome – forward half (wide opening forward toward windscreen)
    { id: 'p51_canopy_fwd', shape: 'cylinder',
      params:   { height: 1.40, diameterTop: 0.30, diameterBottom: 0.90, tessellation: 20 },
      position: { x: 0, y: 0.90, z: 0.62 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.26 } },
    // Bubble dome – aft half (narrows onto turtle-deck)
    { id: 'p51_canopy_aft', shape: 'cylinder',
      params:   { height: 1.00, diameterTop: 0.90, diameterBottom: 0.38, tessellation: 20 },
      position: { x: 0, y: 0.90, z: -0.18 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.26 } },
    // Metal frame rails (left and right canopy bow)
    { id: 'p51_canopy_rail_l', shape: 'box',
      params:   { width: 0.06, height: 0.06, depth: 2.00 },
      position: { x: -0.38, y: 0.94, z: 0.42 },
      rotation: { x: 0, y: 0, z: 0.26 },
      material: { color: '#888888', texture: 'metal', specular: '#BBBBBB' } },
    { id: 'p51_canopy_rail_r', shape: 'box',
      params:   { width: 0.06, height: 0.06, depth: 2.00 },
      position: { x:  0.38, y: 0.94, z: 0.42 },
      rotation: { x: 0, y: 0, z: -0.26 },
      material: { color: '#888888', texture: 'metal', specular: '#BBBBBB' } },
    // Rear armour-plate / head-rest bulkhead
    { id: 'p51_headrest', shape: 'box',
      params:   { width: 0.44, height: 0.36, depth: 0.06 },
      position: { x: 0, y: 0.80, z: -0.70 },
      material: { color: '#555555', texture: 'metal', specular: '#777777' } },

    // ── WINGS – 4 chord-tapering sections + aileron + flap per side ───────────
    // P-51D wing: semi-laminar NACA 45-100 profile, low-mid mount, slight
    // dihedral.  Half-span ≈ 8.4 units; chord tapers from 2.30 at root to tip.

    // LEFT WING
    { id: 'p51_wl_s1', shape: 'box',
      params:   { width: 2.30, height: 0.18, depth: 2.30 },
      position: { x: -1.27, y: 0.02, z: 0.28 },
      material: { color: '#C2C2C2', texture: 'p51_wing', specular: '#AAAAAA' } },
    { id: 'p51_wl_s2', shape: 'box',
      params:   { width: 2.40, height: 0.15, depth: 2.05 },
      position: { x: -3.67, y: 0.04, z: 0.12 },
      material: { color: '#C2C2C2', texture: 'p51_wing', specular: '#AAAAAA' } },
    { id: 'p51_wl_s3', shape: 'box',
      params:   { width: 2.20, height: 0.12, depth: 1.80 },
      position: { x: -5.87, y: 0.08, z: -0.02 },
      material: { color: '#C0C0C0', texture: 'p51_wing', specular: '#AAAAAA' } },
    { id: 'p51_wl_s4', shape: 'box',
      params:   { width: 1.75, height: 0.09, depth: 1.55 },
      position: { x: -7.85, y: 0.12, z: -0.14 },
      material: { color: '#BEBEBE', texture: 'p51_wing', specular: '#999999' } },
    // Left wing tip (rounded half-disc)
    { id: 'p51_wl_tip', shape: 'cylinder',
      params:   { height: 0.22, diameterTop: 1.55, diameterBottom: 0.44, tessellation: 18 },
      position: { x: -8.76, y: 0.10, z: -0.20 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BEBEBE', texture: 'p51_wing', specular: '#999999' } },
    // Left aileron (outer ~35 % of span, trailing edge)
    { id: 'p51_wl_aileron', shape: 'box',
      params:   { width: 3.50, height: 0.06, depth: 0.68 },
      position: { x: -6.85, y: 0.06, z: -0.74 },
      material: { color: '#B8B8B8', specular: '#888888' } },
    // Left combat flap (inner ~65 % of span)
    { id: 'p51_wl_flap', shape: 'box',
      params:   { width: 3.85, height: 0.07, depth: 0.82 },
      position: { x: -3.10, y: 0.00, z: -0.84 },
      material: { color: '#BBBBBB', specular: '#888888' } },
    // Left gun magazine blisters (3 raised fairings above wing, one per gun)
    { id: 'p51_wl_blister1', shape: 'cylinder',
      params:   { height: 0.78, diameter: 0.22, tessellation: 10 },
      position: { x: -1.65, y: 0.18, z: 0.52 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BBBBBB', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wl_blister2', shape: 'cylinder',
      params:   { height: 0.78, diameter: 0.18, tessellation: 10 },
      position: { x: -3.10, y: 0.16, z: 0.40 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BBBBBB', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wl_blister3', shape: 'cylinder',
      params:   { height: 0.78, diameter: 0.15, tessellation: 10 },
      position: { x: -4.62, y: 0.14, z: 0.28 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BBBBBB', texture: 'p51_wing', specular: '#999999' } },
    // Left wing-root fillet (smooth body-to-wing fairing)
    { id: 'p51_wl_fillet', shape: 'cylinder',
      params:   { height: 0.56, diameterTop: 1.10, diameterBottom: 0.40, tessellation: 16 },
      position: { x: -0.30, y: 0.02, z: 0.28 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#BBBBBB' } },

    // RIGHT WING (mirror of left)
    { id: 'p51_wr_s1', shape: 'box',
      params:   { width: 2.30, height: 0.18, depth: 2.30 },
      position: { x:  1.27, y: 0.02, z: 0.28 },
      material: { color: '#C2C2C2', texture: 'p51_wing', specular: '#AAAAAA' } },
    { id: 'p51_wr_s2', shape: 'box',
      params:   { width: 2.40, height: 0.15, depth: 2.05 },
      position: { x:  3.67, y: 0.04, z: 0.12 },
      material: { color: '#C2C2C2', texture: 'p51_wing', specular: '#AAAAAA' } },
    { id: 'p51_wr_s3', shape: 'box',
      params:   { width: 2.20, height: 0.12, depth: 1.80 },
      position: { x:  5.87, y: 0.08, z: -0.02 },
      material: { color: '#C0C0C0', texture: 'p51_wing', specular: '#AAAAAA' } },
    { id: 'p51_wr_s4', shape: 'box',
      params:   { width: 1.75, height: 0.09, depth: 1.55 },
      position: { x:  7.85, y: 0.12, z: -0.14 },
      material: { color: '#BEBEBE', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wr_tip', shape: 'cylinder',
      params:   { height: 0.22, diameterTop: 1.55, diameterBottom: 0.44, tessellation: 18 },
      position: { x:  8.76, y: 0.10, z: -0.20 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BEBEBE', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wr_aileron', shape: 'box',
      params:   { width: 3.50, height: 0.06, depth: 0.68 },
      position: { x:  6.85, y: 0.06, z: -0.74 },
      material: { color: '#B8B8B8', specular: '#888888' } },
    { id: 'p51_wr_flap', shape: 'box',
      params:   { width: 3.85, height: 0.07, depth: 0.82 },
      position: { x:  3.10, y: 0.00, z: -0.84 },
      material: { color: '#BBBBBB', specular: '#888888' } },
    { id: 'p51_wr_blister1', shape: 'cylinder',
      params:   { height: 0.78, diameter: 0.22, tessellation: 10 },
      position: { x:  1.65, y: 0.18, z: 0.52 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BBBBBB', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wr_blister2', shape: 'cylinder',
      params:   { height: 0.78, diameter: 0.18, tessellation: 10 },
      position: { x:  3.10, y: 0.16, z: 0.40 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BBBBBB', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wr_blister3', shape: 'cylinder',
      params:   { height: 0.78, diameter: 0.15, tessellation: 10 },
      position: { x:  4.62, y: 0.14, z: 0.28 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BBBBBB', texture: 'p51_wing', specular: '#999999' } },
    { id: 'p51_wr_fillet', shape: 'cylinder',
      params:   { height: 0.56, diameterTop: 1.10, diameterBottom: 0.40, tessellation: 16 },
      position: { x:  0.30, y: 0.02, z: 0.28 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#BBBBBB' } },

    // ── GUN BARRELS – 6 × .50-cal M2 Browning (3 per wing) ──────────────────
    // Each station: long barrel tube + short muzzle blast tube at leading edge
    // LEFT WING GUNS
    { id: 'p51_gun_l1_barrel', shape: 'cylinder',
      params:   { height: 1.20, diameter: 0.048, tessellation: 8 },
      position: { x: -1.60, y: 0.00, z: 1.62 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'p51_gun_l1_tube', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -1.60, y: 0.00, z: 1.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#666666' } },
    { id: 'p51_gun_l2_barrel', shape: 'cylinder',
      params:   { height: 1.20, diameter: 0.048, tessellation: 8 },
      position: { x: -2.95, y: 0.00, z: 1.48 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'p51_gun_l2_tube', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -2.95, y: 0.00, z: 1.06 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#666666' } },
    { id: 'p51_gun_l3_barrel', shape: 'cylinder',
      params:   { height: 1.10, diameter: 0.048, tessellation: 8 },
      position: { x: -4.50, y: 0.00, z: 1.28 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'p51_gun_l3_tube', shape: 'cylinder',
      params:   { height: 0.26, diameter: 0.10, tessellation: 8 },
      position: { x: -4.50, y: 0.00, z: 0.93 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#666666' } },
    // RIGHT WING GUNS (mirror)
    { id: 'p51_gun_r1_barrel', shape: 'cylinder',
      params:   { height: 1.20, diameter: 0.048, tessellation: 8 },
      position: { x:  1.60, y: 0.00, z: 1.62 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'p51_gun_r1_tube', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  1.60, y: 0.00, z: 1.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#666666' } },
    { id: 'p51_gun_r2_barrel', shape: 'cylinder',
      params:   { height: 1.20, diameter: 0.048, tessellation: 8 },
      position: { x:  2.95, y: 0.00, z: 1.48 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'p51_gun_r2_tube', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  2.95, y: 0.00, z: 1.06 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#666666' } },
    { id: 'p51_gun_r3_barrel', shape: 'cylinder',
      params:   { height: 1.10, diameter: 0.048, tessellation: 8 },
      position: { x:  4.50, y: 0.00, z: 1.28 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'p51_gun_r3_tube', shape: 'cylinder',
      params:   { height: 0.26, diameter: 0.10, tessellation: 8 },
      position: { x:  4.50, y: 0.00, z: 0.93 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#666666' } },

    // ── EXHAUST STACKS – 6 per side (correct for a Merlin V-12) ───────────────
    { id: 'p51_exh_l1', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x: -0.52, y: 0.14, z: 7.10 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_l2', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x: -0.52, y: 0.14, z: 6.74 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_l3', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x: -0.52, y: 0.14, z: 6.38 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_l4', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x: -0.52, y: 0.14, z: 6.02 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_l5', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x: -0.52, y: 0.14, z: 5.66 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_l6', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x: -0.52, y: 0.14, z: 5.30 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_r1', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x:  0.52, y: 0.14, z: 7.10 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_r2', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x:  0.52, y: 0.14, z: 6.74 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_r3', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x:  0.52, y: 0.14, z: 6.38 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_r4', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x:  0.52, y: 0.14, z: 6.02 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_r5', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x:  0.52, y: 0.14, z: 5.66 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'p51_exh_r6', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.090, tessellation: 8 },
      position: { x:  0.52, y: 0.14, z: 5.30 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },

    // ── TAIL SURFACES ─────────────────────────────────────────────────────────
    // Vertical stabilizer – lower + upper sections (swept leading edge)
    { id: 'p51_vstab_lo', shape: 'box',
      params:   { width: 0.13, height: 0.92, depth: 1.72 },
      position: { x: 0, y: 0.62, z: -5.38 },
      material: { color: '#C2C2C2', texture: 'p51_body', specular: '#AAAAAA' } },
    { id: 'p51_vstab_hi', shape: 'box',
      params:   { width: 0.11, height: 1.12, depth: 1.32 },
      position: { x: 0, y: 1.54, z: -5.72 },
      material: { color: '#C2C2C2', texture: 'p51_body', specular: '#AAAAAA' } },
    // Dorsal fin fillet (forward sweep from spine into fin)
    { id: 'p51_dorsal_fin', shape: 'box',
      params:   { width: 0.10, height: 0.48, depth: 1.00 },
      position: { x: 0, y: 0.40, z: -4.86 },
      rotation: { x: -0.22, y: 0, z: 0 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    // Ventral fin (small keel below aft fuselage)
    { id: 'p51_ventral_fin', shape: 'box',
      params:   { width: 0.09, height: 0.42, depth: 0.76 },
      position: { x: 0, y: -0.26, z: -5.88 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    // Rudder + trim tab
    { id: 'p51_rudder', shape: 'box',
      params:   { width: 0.09, height: 1.60, depth: 0.66 },
      position: { x: 0, y: 1.50, z: -6.68 },
      material: { color: '#BBBBBB', specular: '#888888' } },
    { id: 'p51_rudder_tab', shape: 'box',
      params:   { width: 0.07, height: 0.38, depth: 0.24 },
      position: { x: 0, y: 1.18, z: -7.05 },
      material: { color: '#B0B0B0', specular: '#777777' } },
    // Horizontal stabilizer – LEFT (2 chord sections + rounded tip)
    { id: 'p51_hstab_l_inr', shape: 'box',
      params:   { width: 2.10, height: 0.13, depth: 1.10 },
      position: { x: -1.15, y: 0.14, z: -5.26 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    { id: 'p51_hstab_l_out', shape: 'box',
      params:   { width: 1.90, height: 0.10, depth: 0.88 },
      position: { x: -3.00, y: 0.14, z: -5.48 },
      material: { color: '#BEBEBE', texture: 'p51_body', specular: '#999999' } },
    { id: 'p51_hstab_l_tip', shape: 'cylinder',
      params:   { height: 0.18, diameterTop: 0.88, diameterBottom: 0.28, tessellation: 14 },
      position: { x: -3.98, y: 0.14, z: -5.56 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BEBEBE', specular: '#999999' } },
    // Left elevator + trim tab
    { id: 'p51_elev_l', shape: 'box',
      params:   { width: 2.90, height: 0.09, depth: 0.48 },
      position: { x: -2.10, y: 0.14, z: -6.00 },
      material: { color: '#B8B8B8', specular: '#888888' } },
    { id: 'p51_elev_l_tab', shape: 'box',
      params:   { width: 0.80, height: 0.07, depth: 0.18 },
      position: { x: -2.35, y: 0.14, z: -6.28 },
      material: { color: '#B0B0B0', specular: '#777777' } },
    // Horizontal stabilizer – RIGHT
    { id: 'p51_hstab_r_inr', shape: 'box',
      params:   { width: 2.10, height: 0.13, depth: 1.10 },
      position: { x:  1.15, y: 0.14, z: -5.26 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    { id: 'p51_hstab_r_out', shape: 'box',
      params:   { width: 1.90, height: 0.10, depth: 0.88 },
      position: { x:  3.00, y: 0.14, z: -5.48 },
      material: { color: '#BEBEBE', texture: 'p51_body', specular: '#999999' } },
    { id: 'p51_hstab_r_tip', shape: 'cylinder',
      params:   { height: 0.18, diameterTop: 0.88, diameterBottom: 0.28, tessellation: 14 },
      position: { x:  3.98, y: 0.14, z: -5.56 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#BEBEBE', specular: '#999999' } },
    { id: 'p51_elev_r', shape: 'box',
      params:   { width: 2.90, height: 0.09, depth: 0.48 },
      position: { x:  2.10, y: 0.14, z: -6.00 },
      material: { color: '#B8B8B8', specular: '#888888' } },
    { id: 'p51_elev_r_tab', shape: 'box',
      params:   { width: 0.80, height: 0.07, depth: 0.18 },
      position: { x:  2.35, y: 0.14, z: -6.28 },
      material: { color: '#B0B0B0', specular: '#777777' } },

    // ── 4-BLADE HAMILTON STANDARD PROPELLER ───────────────────────────────────
    // Two crossed blade pairs represent all 4 blades.  All tagged isProp:true.
    { id: 'p51_prop_blade_v', shape: 'box',
      params:   { width: 0.16, height: 4.05, depth: 0.09 },
      position: { x: 0, y: 0.08, z: 7.54 },
      material: { color: '#2A2A2A', texture: 'propeller', specular: '#555555' },
      isProp: true },
    { id: 'p51_prop_blade_h', shape: 'box',
      params:   { width: 4.05, height: 0.16, depth: 0.09 },
      position: { x: 0, y: 0.08, z: 7.57 },
      material: { color: '#2A2A2A', texture: 'propeller', specular: '#555555' },
      isProp: true },
    // Blade-root cuffs (4 × tapered cylinder stubs at hub)
    { id: 'p51_prop_cuff_t', shape: 'cylinder',
      params:   { height: 0.50, diameterTop: 0.24, diameterBottom: 0.36, tessellation: 10 },
      position: { x: 0, y: 0.50, z: 7.55 },
      material: { color: '#333333', specular: '#666666' },
      isProp: true },
    { id: 'p51_prop_cuff_b', shape: 'cylinder',
      params:   { height: 0.50, diameterTop: 0.36, diameterBottom: 0.24, tessellation: 10 },
      position: { x: 0, y: -0.34, z: 7.55 },
      material: { color: '#333333', specular: '#666666' },
      isProp: true },
    { id: 'p51_prop_cuff_r', shape: 'cylinder',
      params:   { height: 0.50, diameterTop: 0.24, diameterBottom: 0.36, tessellation: 10 },
      position: { x:  0.42, y: 0.08, z: 7.55 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#333333', specular: '#666666' },
      isProp: true },
    { id: 'p51_prop_cuff_l', shape: 'cylinder',
      params:   { height: 0.50, diameterTop: 0.36, diameterBottom: 0.24, tessellation: 10 },
      position: { x: -0.42, y: 0.08, z: 7.55 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#333333', specular: '#666666' },
      isProp: true },
    // Characteristic yellow spinner
    { id: 'p51_spinner', shape: 'cylinder',
      params:   { height: 0.65, diameterTop: 0.10, diameterBottom: 0.74, tessellation: 20 },
      position: { x: 0, y: 0.08, z: 7.36 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#FFCC00', texture: 'metal', specular: '#EEEEEE' } },
    // Prop hub ring
    { id: 'p51_prop_hub', shape: 'cylinder',
      params:   { height: 0.24, diameter: 0.44, tessellation: 20 },
      position: { x: 0, y: 0.08, z: 7.60 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', texture: 'metal', specular: '#888888' } },

    // ── LANDING GEAR (taildragger) ────────────────────────────────────────────
    // LEFT main gear: oleo strut + lower fork + axle + tire + hub + 2 doors
    { id: 'p51_gear_l_oleo', shape: 'cylinder',
      params:   { height: 0.76, diameter: 0.11, tessellation: 10 },
      position: { x: -0.62, y: -0.50, z: 0.80 },
      rotation: { x: 0, y: 0, z: 0.18 },
      material: { color: '#AAAAAA', specular: '#DDDDDD' } },
    { id: 'p51_gear_l_fork', shape: 'cylinder',
      params:   { height: 0.42, diameter: 0.08, tessellation: 8 },
      position: { x: -0.76, y: -0.88, z: 0.80 },
      rotation: { x: 0, y: 0, z: 0.15 },
      material: { color: '#777777', specular: '#AAAAAA' } },
    { id: 'p51_gear_l_axle', shape: 'cylinder',
      params:   { height: 0.24, diameter: 0.06, tessellation: 8 },
      position: { x: -0.88, y: -1.08, z: 0.80 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#888888', specular: '#BBBBBB' } },
    { id: 'p51_wheel_l_tire', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.52, tessellation: 18 },
      position: { x: -0.88, y: -1.08, z: 0.80 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#151515', texture: 'tire' } },
    { id: 'p51_wheel_l_hub', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.28, tessellation: 12 },
      position: { x: -0.88, y: -1.08, z: 0.80 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#888888', specular: '#CCCCCC' } },
    { id: 'p51_gear_door_l1', shape: 'box',
      params:   { width: 0.06, height: 0.64, depth: 0.44 },
      position: { x: -0.68, y: -0.40, z: 1.06 },
      rotation: { x: 0, y: 0, z: 0.18 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    { id: 'p51_gear_door_l2', shape: 'box',
      params:   { width: 0.06, height: 0.64, depth: 0.44 },
      position: { x: -0.68, y: -0.40, z: 0.54 },
      rotation: { x: 0, y: 0, z: 0.18 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    // RIGHT main gear (mirror)
    { id: 'p51_gear_r_oleo', shape: 'cylinder',
      params:   { height: 0.76, diameter: 0.11, tessellation: 10 },
      position: { x:  0.62, y: -0.50, z: 0.80 },
      rotation: { x: 0, y: 0, z: -0.18 },
      material: { color: '#AAAAAA', specular: '#DDDDDD' } },
    { id: 'p51_gear_r_fork', shape: 'cylinder',
      params:   { height: 0.42, diameter: 0.08, tessellation: 8 },
      position: { x:  0.76, y: -0.88, z: 0.80 },
      rotation: { x: 0, y: 0, z: -0.15 },
      material: { color: '#777777', specular: '#AAAAAA' } },
    { id: 'p51_gear_r_axle', shape: 'cylinder',
      params:   { height: 0.24, diameter: 0.06, tessellation: 8 },
      position: { x:  0.88, y: -1.08, z: 0.80 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#888888', specular: '#BBBBBB' } },
    { id: 'p51_wheel_r_tire', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.52, tessellation: 18 },
      position: { x:  0.88, y: -1.08, z: 0.80 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#151515', texture: 'tire' } },
    { id: 'p51_wheel_r_hub', shape: 'cylinder',
      params:   { height: 0.30, diameter: 0.28, tessellation: 12 },
      position: { x:  0.88, y: -1.08, z: 0.80 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#888888', specular: '#CCCCCC' } },
    { id: 'p51_gear_door_r1', shape: 'box',
      params:   { width: 0.06, height: 0.64, depth: 0.44 },
      position: { x:  0.68, y: -0.40, z: 1.06 },
      rotation: { x: 0, y: 0, z: -0.18 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    { id: 'p51_gear_door_r2', shape: 'box',
      params:   { width: 0.06, height: 0.64, depth: 0.44 },
      position: { x:  0.68, y: -0.40, z: 0.54 },
      rotation: { x: 0, y: 0, z: -0.18 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },
    // Tail wheel + fairing door
    { id: 'p51_tailgear_strut', shape: 'cylinder',
      params:   { height: 0.36, diameter: 0.06, tessellation: 8 },
      position: { x: 0, y: -0.44, z: -5.30 },
      material: { color: '#777777', specular: '#AAAAAA' } },
    { id: 'p51_tailgear_wheel', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.26, tessellation: 12 },
      position: { x: 0, y: -0.70, z: -5.30 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#1A1A1A', texture: 'tire' } },
    { id: 'p51_tailgear_door', shape: 'box',
      params:   { width: 0.22, height: 0.28, depth: 0.36 },
      position: { x: 0, y: -0.40, z: -5.30 },
      material: { color: '#C0C0C0', texture: 'p51_body', specular: '#AAAAAA' } },

    // ── SURFACE DETAILS ───────────────────────────────────────────────────────
    // Pitot tube (left wing leading edge)
    { id: 'p51_pitot', shape: 'cylinder',
      params:   { height: 0.62, diameterTop: 0.022, diameterBottom: 0.042, tessellation: 6 },
      position: { x: -3.52, y: 0.04, z: 1.70 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#CCCCCC', specular: '#EEEEEE' } },
    // Radio antenna mast
    { id: 'p51_antenna_mast', shape: 'box',
      params:   { width: 0.04, height: 0.34, depth: 0.06 },
      position: { x: 0, y: 0.68, z: -0.85 },
      material: { color: '#888888', specular: '#BBBBBB' } },
    // Antenna wire (mast to vertical fin tip)
    { id: 'p51_antenna_wire', shape: 'box',
      params:   { width: 0.018, height: 0.04, depth: 4.70 },
      position: { x: 0, y: 0.98, z: -3.28 },
      rotation: { x: 0.12, y: 0, z: 0 },
      material: { color: '#666666' } },
    // Non-slip wing walkway strips (black painted area)
    { id: 'p51_walkway_l', shape: 'box',
      params:   { width: 0.85, height: 0.01, depth: 1.15 },
      position: { x: -0.62, y: 0.20, z: 0.46 },
      material: { color: '#2A2A2A' } },
    { id: 'p51_walkway_r', shape: 'box',
      params:   { width: 0.85, height: 0.01, depth: 1.15 },
      position: { x:  0.62, y: 0.20, z: 0.46 },
      material: { color: '#2A2A2A' } },
    // USAAF star-and-bar national insignia – left wing upper
    { id: 'p51_insig_lw_bg', shape: 'box',
      params:   { width: 1.75, height: 0.01, depth: 0.96 },
      position: { x: -5.35, y: 0.17, z: -0.08 },
      material: { color: '#2456A4' } },
    { id: 'p51_insig_lw_star', shape: 'box',
      params:   { width: 0.90, height: 0.01, depth: 0.56 },
      position: { x: -5.35, y: 0.18, z: -0.08 },
      material: { color: '#FFFFFF' } },
    // Right wing lower
    { id: 'p51_insig_rw', shape: 'box',
      params:   { width: 1.75, height: 0.01, depth: 0.96 },
      position: { x:  5.35, y: -0.12, z: -0.08 },
      material: { color: '#2456A4' } },
    // Fuselage insignia (left side)
    { id: 'p51_insig_fuse', shape: 'box',
      params:   { width: 0.03, height: 0.68, depth: 0.92 },
      position: { x: -0.52, y: 0.08, z: -1.76 },
      material: { color: '#2456A4' } },
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
    // ══════════════════════════════════════════════════════════════════════════
    // B-17G FLYING FORTRESS — ~150-part high-fidelity geometry
    // +Z = nose, -Z = tail, +Y = up, +X = right wing.  Scale ≈ 1.25 m / unit
    // (real length 22.7 m ≈ 24.7 model units; wingspan 31.6 m ≈ 27 units)
    // All 7 defensive gun positions modelled; bomb bay structure visible.
    // ══════════════════════════════════════════════════════════════════════════

    // ── FUSELAGE – 8 smooth cylinder sections ─────────────────────────────────
    // S1 – glazed nose greenhouse (bombardier/navigator – clear glass)
    { id: 'b17_fuse_nose', shape: 'cylinder',
      params:   { height: 3.50, diameterTop: 0.30, diameterBottom: 2.40, tessellation: 24 },
      position: { x: 0, y: 0.15, z: 10.75 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.32 } },

    // S2 – forward crew compartment (nose section framing behind glass)
    { id: 'b17_fuse_s2', shape: 'cylinder',
      params:   { height: 4.50, diameterTop: 2.40, diameterBottom: 2.52, tessellation: 24 },
      position: { x: 0, y: 0.10, z: 7.75 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    // S3 – cockpit section (pilot / co-pilot; greenhouse hump above)
    { id: 'b17_fuse_s3', shape: 'cylinder',
      params:   { height: 3.00, diameterTop: 2.52, diameterBottom: 2.52, tessellation: 24 },
      position: { x: 0, y: 0.00, z: 4.00 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    // S4 – bomb bay section (no visual hole – doors handled by client)
    { id: 'b17_fuse_s4', shape: 'cylinder',
      params:   { height: 4.00, diameterTop: 2.52, diameterBottom: 2.48, tessellation: 24 },
      position: { x: 0, y: 0.00, z: 0.50 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    // S5 – waist gunner section
    { id: 'b17_fuse_s5', shape: 'cylinder',
      params:   { height: 3.50, diameterTop: 2.48, diameterBottom: 2.30, tessellation: 24 },
      position: { x: 0, y: 0.00, z: -3.25 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    // S6 – aft fuselage begins tapering
    { id: 'b17_fuse_s6', shape: 'cylinder',
      params:   { height: 2.50, diameterTop: 2.30, diameterBottom: 1.80, tessellation: 24 },
      position: { x: 0, y: 0.00, z: -6.25 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#435020', texture: 'b17_body', specular: '#444444' } },

    // S7 – narrowing tail section
    { id: 'b17_fuse_s7', shape: 'cylinder',
      params:   { height: 2.50, diameterTop: 1.80, diameterBottom: 1.10, tessellation: 24 },
      position: { x: 0, y: 0.00, z: -8.75 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#3A4218', texture: 'b17_body', specular: '#444444' } },

    // S8 – tail cone to near-point
    { id: 'b17_fuse_s8', shape: 'cylinder',
      params:   { height: 2.00, diameterTop: 1.10, diameterBottom: 0.28, tessellation: 20 },
      position: { x: 0, y: 0.00, z: -11.00 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#333818', texture: 'b17_body', specular: '#333333' } },

    // ── COCKPIT GREENHOUSE STRUCTURE ──────────────────────────────────────────
    // The distinctive raised greenhouse above the forward fuselage
    { id: 'b17_greenhouse_base', shape: 'box',
      params:   { width: 1.65, height: 0.58, depth: 3.60 },
      position: { x: 0, y: 1.44, z: 7.20 },
      material: { color: '#3A4218', specular: '#333333' } },
    { id: 'b17_greenhouse_top', shape: 'cylinder',
      params:   { height: 3.50, diameter: 1.55, tessellation: 16 },
      position: { x: 0, y: 1.74, z: 7.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.28 } },
    // Forward cockpit glass (angled windscreen panels)
    { id: 'b17_cockpit_wind_l', shape: 'box',
      params:   { width: 0.62, height: 0.55, depth: 0.06 },
      position: { x: -0.36, y: 1.68, z: 8.98 },
      rotation: { x: -0.16, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.24 } },
    { id: 'b17_cockpit_wind_r', shape: 'box',
      params:   { width: 0.62, height: 0.55, depth: 0.06 },
      position: { x:  0.36, y: 1.68, z: 8.98 },
      rotation: { x: -0.16, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.24 } },
    // Side cockpit windows
    { id: 'b17_cockpit_win_l', shape: 'box',
      params:   { width: 0.06, height: 0.52, depth: 1.80 },
      position: { x: -0.83, y: 1.68, z: 7.30 },
      material: { color: '#1A3A5C', alpha: 0.22 } },
    { id: 'b17_cockpit_win_r', shape: 'box',
      params:   { width: 0.06, height: 0.52, depth: 1.80 },
      position: { x:  0.83, y: 1.68, z: 7.30 },
      material: { color: '#1A3A5C', alpha: 0.22 } },

    // ── HIGH-MOUNTED WINGS – 4 chord-tapered sections per side ───────────────
    // B-17 wing: constant-taper, high mount, ~4.5° dihedral.
    // Total half-span ≈ 13.5 units (real 15.8 m at this scale).

    // LEFT WING
    { id: 'b17_wl_s1', shape: 'box',
      params:   { width: 3.00, height: 0.28, depth: 3.20 },
      position: { x: -2.75, y: 0.72, z: 1.80 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wl_s2', shape: 'box',
      params:   { width: 3.40, height: 0.22, depth: 2.80 },
      position: { x: -6.10, y: 0.84, z: 1.30 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wl_s3', shape: 'box',
      params:   { width: 3.20, height: 0.18, depth: 2.30 },
      position: { x: -9.30, y: 0.96, z: 0.80 },
      material: { color: '#455018', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wl_s4', shape: 'box',
      params:   { width: 2.80, height: 0.13, depth: 1.70 },
      position: { x: -12.20, y: 1.10, z: 0.30 },
      material: { color: '#3F4A16', texture: 'b17_wing', specular: '#333333' } },
    // Left wing tip
    { id: 'b17_wl_tip', shape: 'cylinder',
      params:   { height: 0.30, diameterTop: 1.70, diameterBottom: 0.50, tessellation: 18 },
      position: { x: -13.65, y: 1.16, z: 0.20 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#3F4A16', texture: 'b17_wing', specular: '#333333' } },
    // Left aileron
    { id: 'b17_wl_aileron', shape: 'box',
      params:   { width: 4.00, height: 0.10, depth: 0.75 },
      position: { x: -11.00, y: 1.02, z: -0.45 },
      material: { color: '#3A4218', specular: '#333333' } },
    // Left inboard flap
    { id: 'b17_wl_flap', shape: 'box',
      params:   { width: 4.50, height: 0.12, depth: 0.90 },
      position: { x: -4.75, y: 0.72, z: -0.55 },
      material: { color: '#3D4A1A', specular: '#333333' } },
    // Left wing root fillet
    { id: 'b17_wl_fillet', shape: 'cylinder',
      params:   { height: 0.70, diameterTop: 2.60, diameterBottom: 0.80, tessellation: 20 },
      position: { x: -0.60, y: 0.60, z: 1.60 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    // RIGHT WING (mirror)
    { id: 'b17_wr_s1', shape: 'box',
      params:   { width: 3.00, height: 0.28, depth: 3.20 },
      position: { x:  2.75, y: 0.72, z: 1.80 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wr_s2', shape: 'box',
      params:   { width: 3.40, height: 0.22, depth: 2.80 },
      position: { x:  6.10, y: 0.84, z: 1.30 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wr_s3', shape: 'box',
      params:   { width: 3.20, height: 0.18, depth: 2.30 },
      position: { x:  9.30, y: 0.96, z: 0.80 },
      material: { color: '#455018', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wr_s4', shape: 'box',
      params:   { width: 2.80, height: 0.13, depth: 1.70 },
      position: { x:  12.20, y: 1.10, z: 0.30 },
      material: { color: '#3F4A16', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wr_tip', shape: 'cylinder',
      params:   { height: 0.30, diameterTop: 1.70, diameterBottom: 0.50, tessellation: 18 },
      position: { x:  13.65, y: 1.16, z: 0.20 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#3F4A16', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_wr_aileron', shape: 'box',
      params:   { width: 4.00, height: 0.10, depth: 0.75 },
      position: { x:  11.00, y: 1.02, z: -0.45 },
      material: { color: '#3A4218', specular: '#333333' } },
    { id: 'b17_wr_flap', shape: 'box',
      params:   { width: 4.50, height: 0.12, depth: 0.90 },
      position: { x:  4.75, y: 0.72, z: -0.55 },
      material: { color: '#3D4A1A', specular: '#333333' } },
    { id: 'b17_wr_fillet', shape: 'cylinder',
      params:   { height: 0.70, diameterTop: 2.60, diameterBottom: 0.80, tessellation: 20 },
      position: { x:  0.60, y: 0.60, z: 1.60 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#444444' } },

    // ── ENGINE NACELLES – 4 × Wright R-1820 Cyclone radial engines ───────────
    // Each nacelle: main body + cowl ring + engine face disc + exhaust stacks
    // Inboard-left (L1)
    { id: 'b17_nac_l1', shape: 'cylinder',
      params:   { height: 3.00, diameterTop: 0.46, diameterBottom: 0.72, tessellation: 20 },
      position: { x: -3.50, y: 0.52, z: 2.10 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },
    { id: 'b17_nac_ring_l1', shape: 'cylinder',
      params:   { height: 0.18, diameter: 0.74, tessellation: 20 },
      position: { x: -3.50, y: 0.52, z: 3.66 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#555555', texture: 'metal', specular: '#BBBBBB' } },
    // Engine face – centre hub + visible radial cylinder ring
    { id: 'b17_eng_face_l1', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.58, tessellation: 20 },
      position: { x: -3.50, y: 0.52, z: 3.82 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#2A2A2A', specular: '#555555' } },
    { id: 'b17_eng_hub_l1', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.18, tessellation: 12 },
      position: { x: -3.50, y: 0.52, z: 3.94 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#888888' } },
    // Nacelle rear tunnel fairing into wing
    { id: 'b17_nac_l1_rear', shape: 'cylinder',
      params:   { height: 1.20, diameterTop: 0.72, diameterBottom: 0.40, tessellation: 16 },
      position: { x: -3.50, y: 0.52, z: 0.70 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#777777', texture: 'metal', specular: '#999999' } },
    // Intercooler / supercharger inlet (below nacelle, characteristic B-17 feature)
    { id: 'b17_inter_l1', shape: 'box',
      params:   { width: 0.30, height: 0.26, depth: 1.40 },
      position: { x: -3.50, y: 0.12, z: 1.60 },
      material: { color: '#666666', texture: 'metal', specular: '#888888' } },
    // Exhaust stacks (3 per nacelle along bottom of cowl)
    { id: 'b17_exh_l1a', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -3.80, y: 0.18, z: 3.40 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_l1b', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -3.80, y: 0.18, z: 3.08 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_l1c', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -3.80, y: 0.18, z: 2.76 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },

    // Outboard-left (L2)
    { id: 'b17_nac_l2', shape: 'cylinder',
      params:   { height: 3.00, diameterTop: 0.46, diameterBottom: 0.72, tessellation: 20 },
      position: { x: -8.50, y: 0.68, z: 1.30 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },
    { id: 'b17_nac_ring_l2', shape: 'cylinder',
      params:   { height: 0.18, diameter: 0.74, tessellation: 20 },
      position: { x: -8.50, y: 0.68, z: 2.86 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#555555', texture: 'metal', specular: '#BBBBBB' } },
    { id: 'b17_eng_face_l2', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.58, tessellation: 20 },
      position: { x: -8.50, y: 0.68, z: 3.02 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#2A2A2A', specular: '#555555' } },
    { id: 'b17_eng_hub_l2', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.18, tessellation: 12 },
      position: { x: -8.50, y: 0.68, z: 3.14 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#888888' } },
    { id: 'b17_nac_l2_rear', shape: 'cylinder',
      params:   { height: 1.20, diameterTop: 0.72, diameterBottom: 0.40, tessellation: 16 },
      position: { x: -8.50, y: 0.68, z: -0.10 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#777777', texture: 'metal', specular: '#999999' } },
    { id: 'b17_inter_l2', shape: 'box',
      params:   { width: 0.30, height: 0.26, depth: 1.40 },
      position: { x: -8.50, y: 0.30, z: 0.90 },
      material: { color: '#666666', texture: 'metal', specular: '#888888' } },
    { id: 'b17_exh_l2a', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -8.80, y: 0.34, z: 2.60 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_l2b', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -8.80, y: 0.34, z: 2.28 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_l2c', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x: -8.80, y: 0.34, z: 1.96 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },

    // Inboard-right (R1) – mirror of L1
    { id: 'b17_nac_r1', shape: 'cylinder',
      params:   { height: 3.00, diameterTop: 0.46, diameterBottom: 0.72, tessellation: 20 },
      position: { x:  3.50, y: 0.52, z: 2.10 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },
    { id: 'b17_nac_ring_r1', shape: 'cylinder',
      params:   { height: 0.18, diameter: 0.74, tessellation: 20 },
      position: { x:  3.50, y: 0.52, z: 3.66 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#555555', texture: 'metal', specular: '#BBBBBB' } },
    { id: 'b17_eng_face_r1', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.58, tessellation: 20 },
      position: { x:  3.50, y: 0.52, z: 3.82 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#2A2A2A', specular: '#555555' } },
    { id: 'b17_eng_hub_r1', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.18, tessellation: 12 },
      position: { x:  3.50, y: 0.52, z: 3.94 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#888888' } },
    { id: 'b17_nac_r1_rear', shape: 'cylinder',
      params:   { height: 1.20, diameterTop: 0.72, diameterBottom: 0.40, tessellation: 16 },
      position: { x:  3.50, y: 0.52, z: 0.70 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#777777', texture: 'metal', specular: '#999999' } },
    { id: 'b17_inter_r1', shape: 'box',
      params:   { width: 0.30, height: 0.26, depth: 1.40 },
      position: { x:  3.50, y: 0.12, z: 1.60 },
      material: { color: '#666666', texture: 'metal', specular: '#888888' } },
    { id: 'b17_exh_r1a', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  3.80, y: 0.18, z: 3.40 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_r1b', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  3.80, y: 0.18, z: 3.08 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_r1c', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  3.80, y: 0.18, z: 2.76 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },

    // Outboard-right (R2) – mirror of L2
    { id: 'b17_nac_r2', shape: 'cylinder',
      params:   { height: 3.00, diameterTop: 0.46, diameterBottom: 0.72, tessellation: 20 },
      position: { x:  8.50, y: 0.68, z: 1.30 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#888888', texture: 'metal', specular: '#AAAAAA' } },
    { id: 'b17_nac_ring_r2', shape: 'cylinder',
      params:   { height: 0.18, diameter: 0.74, tessellation: 20 },
      position: { x:  8.50, y: 0.68, z: 2.86 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#555555', texture: 'metal', specular: '#BBBBBB' } },
    { id: 'b17_eng_face_r2', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.58, tessellation: 20 },
      position: { x:  8.50, y: 0.68, z: 3.02 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#2A2A2A', specular: '#555555' } },
    { id: 'b17_eng_hub_r2', shape: 'cylinder',
      params:   { height: 0.16, diameter: 0.18, tessellation: 12 },
      position: { x:  8.50, y: 0.68, z: 3.14 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', specular: '#888888' } },
    { id: 'b17_nac_r2_rear', shape: 'cylinder',
      params:   { height: 1.20, diameterTop: 0.72, diameterBottom: 0.40, tessellation: 16 },
      position: { x:  8.50, y: 0.68, z: -0.10 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#777777', texture: 'metal', specular: '#999999' } },
    { id: 'b17_inter_r2', shape: 'box',
      params:   { width: 0.30, height: 0.26, depth: 1.40 },
      position: { x:  8.50, y: 0.30, z: 0.90 },
      material: { color: '#666666', texture: 'metal', specular: '#888888' } },
    { id: 'b17_exh_r2a', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  8.80, y: 0.34, z: 2.60 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_r2b', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  8.80, y: 0.34, z: 2.28 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },
    { id: 'b17_exh_r2c', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.10, tessellation: 8 },
      position: { x:  8.80, y: 0.34, z: 1.96 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#222222', specular: '#777777' } },

    // ── 3-BLADE PROPELLERS (4 engines × 3 blades each) ────────────────────────
    // B-17G Hamilton Standard 3-blade propellers.
    // Blade A: vertical (0°), Blade B: +120°, Blade C: -120°.
    // All isProp: true so client spins them together.

    // ENGINE L1 props
    { id: 'b17_prop_l1a', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x: -3.50, y: 0.52, z: 4.00 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_l1b', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x: -3.50, y: 0.52, z: 4.03 },
      rotation: { x: 0, y: 0, z: 2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_l1c', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x: -3.50, y: 0.52, z: 4.06 },
      rotation: { x: 0, y: 0, z: -2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_spinner_l1', shape: 'cylinder',
      params:   { height: 0.55, diameterTop: 0.10, diameterBottom: 0.56, tessellation: 16 },
      position: { x: -3.50, y: 0.52, z: 3.82 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', texture: 'metal', specular: '#888888' } },

    // ENGINE L2 props
    { id: 'b17_prop_l2a', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x: -8.50, y: 0.68, z: 3.20 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_l2b', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x: -8.50, y: 0.68, z: 3.23 },
      rotation: { x: 0, y: 0, z: 2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_l2c', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x: -8.50, y: 0.68, z: 3.26 },
      rotation: { x: 0, y: 0, z: -2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_spinner_l2', shape: 'cylinder',
      params:   { height: 0.55, diameterTop: 0.10, diameterBottom: 0.56, tessellation: 16 },
      position: { x: -8.50, y: 0.68, z: 3.02 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', texture: 'metal', specular: '#888888' } },

    // ENGINE R1 props
    { id: 'b17_prop_r1a', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x:  3.50, y: 0.52, z: 4.00 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_r1b', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x:  3.50, y: 0.52, z: 4.03 },
      rotation: { x: 0, y: 0, z: 2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_r1c', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x:  3.50, y: 0.52, z: 4.06 },
      rotation: { x: 0, y: 0, z: -2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_spinner_r1', shape: 'cylinder',
      params:   { height: 0.55, diameterTop: 0.10, diameterBottom: 0.56, tessellation: 16 },
      position: { x:  3.50, y: 0.52, z: 3.82 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', texture: 'metal', specular: '#888888' } },

    // ENGINE R2 props
    { id: 'b17_prop_r2a', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x:  8.50, y: 0.68, z: 3.20 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_r2b', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x:  8.50, y: 0.68, z: 3.23 },
      rotation: { x: 0, y: 0, z: 2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_prop_r2c', shape: 'box',
      params:   { width: 0.16, height: 3.80, depth: 0.08 },
      position: { x:  8.50, y: 0.68, z: 3.26 },
      rotation: { x: 0, y: 0, z: -2.094 },
      material: { color: '#222222', texture: 'propeller' }, isProp: true },
    { id: 'b17_spinner_r2', shape: 'cylinder',
      params:   { height: 0.55, diameterTop: 0.10, diameterBottom: 0.56, tessellation: 16 },
      position: { x:  8.50, y: 0.68, z: 3.02 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#444444', texture: 'metal', specular: '#888888' } },

    // ── DEFENSIVE ARMAMENT – ALL 7 GUN POSITIONS ─────────────────────────────

    // 1 – CHIN TURRET (Bendix – 2 × .50 cal, under nose, B-17G)
    { id: 'b17_chin_ring', shape: 'cylinder',
      params:   { height: 0.20, diameter: 0.90, tessellation: 16 },
      position: { x: 0, y: -0.48, z: 9.60 },
      material: { color: '#444444', specular: '#666666' } },
    { id: 'b17_chin_body', shape: 'cylinder',
      params:   { height: 0.55, diameter: 0.86, tessellation: 16 },
      position: { x: 0, y: -0.82, z: 9.60 },
      material: { color: '#333333', specular: '#555555' } },
    { id: 'b17_chin_dome', shape: 'cylinder',
      params:   { height: 0.24, diameterTop: 0.10, diameterBottom: 0.84, tessellation: 16 },
      position: { x: 0, y: -1.12, z: 9.60 },
      material: { color: '#1A3A5C', alpha: 0.35 } },
    { id: 'b17_chin_bar_l', shape: 'cylinder',
      params:   { height: 1.00, diameter: 0.07, tessellation: 6 },
      position: { x: -0.24, y: -1.02, z: 10.12 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'b17_chin_bar_r', shape: 'cylinder',
      params:   { height: 1.00, diameter: 0.07, tessellation: 6 },
      position: { x:  0.24, y: -1.02, z: 10.12 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // 2 – CHEEK GUNS (nose sides, B-17G addition – 1 × .50 cal per side)
    { id: 'b17_cheek_win_l', shape: 'box',
      params:   { width: 0.06, height: 0.46, depth: 0.48 },
      position: { x: -1.18, y: 0.22, z: 10.20 },
      material: { color: '#1A3A5C', alpha: 0.30 } },
    { id: 'b17_cheek_gun_l', shape: 'cylinder',
      params:   { height: 0.80, diameter: 0.07, tessellation: 6 },
      position: { x: -1.42, y: 0.22, z: 10.20 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'b17_cheek_win_r', shape: 'box',
      params:   { width: 0.06, height: 0.46, depth: 0.48 },
      position: { x:  1.18, y: 0.22, z: 10.20 },
      material: { color: '#1A3A5C', alpha: 0.30 } },
    { id: 'b17_cheek_gun_r', shape: 'cylinder',
      params:   { height: 0.80, diameter: 0.07, tessellation: 6 },
      position: { x:  1.42, y: 0.22, z: 10.20 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // 3 – TOP TURRET (Sperry A-1 – 2 × .50 cal; just aft of cockpit)
    { id: 'b17_top_ring', shape: 'cylinder',
      params:   { height: 0.22, diameter: 0.84, tessellation: 16 },
      position: { x: 0, y: 1.42, z: 5.50 },
      material: { color: '#444444', specular: '#666666' } },
    { id: 'b17_top_dome', shape: 'cylinder',
      params:   { height: 0.46, diameterTop: 0.10, diameterBottom: 0.82, tessellation: 16 },
      position: { x: 0, y: 1.72, z: 5.50 },
      material: { color: '#1A3A5C', alpha: 0.34 } },
    { id: 'b17_top_bar_l', shape: 'cylinder',
      params:   { height: 0.80, diameter: 0.07, tessellation: 6 },
      position: { x: -0.20, y: 2.02, z: 5.80 },
      rotation: { x: -0.30, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'b17_top_bar_r', shape: 'cylinder',
      params:   { height: 0.80, diameter: 0.07, tessellation: 6 },
      position: { x:  0.20, y: 2.02, z: 5.80 },
      rotation: { x: -0.30, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // 4 – RADIO ROOM GUN (single .50 cal through top fuselage hatch)
    { id: 'b17_radio_hatch', shape: 'box',
      params:   { width: 0.38, height: 0.08, depth: 0.38 },
      position: { x: 0, y: 1.28, z: 3.20 },
      material: { color: '#555555', texture: 'metal', specular: '#777777' } },
    { id: 'b17_radio_gun', shape: 'cylinder',
      params:   { height: 0.80, diameter: 0.07, tessellation: 6 },
      position: { x: 0, y: 1.72, z: 3.00 },
      rotation: { x: 0.40, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // 5 – BALL TURRET (Sperry belly – 2 × .50 cal)
    { id: 'b17_ball_shell', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.90, tessellation: 20 },
      position: { x: 0, y: -1.42, z: 0.50 },
      material: { color: '#222222', specular: '#555555' } },
    { id: 'b17_ball_glass', shape: 'cylinder',
      params:   { height: 0.60, diameterTop: 0.80, diameterBottom: 0.80, tessellation: 20 },
      position: { x: 0, y: -1.72, z: 0.50 },
      material: { color: '#1A3A5C', alpha: 0.36 } },
    { id: 'b17_ball_bar_l', shape: 'cylinder',
      params:   { height: 0.70, diameter: 0.07, tessellation: 6 },
      position: { x: -0.20, y: -2.08, z: 0.30 },
      rotation: { x: 0.30, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'b17_ball_bar_r', shape: 'cylinder',
      params:   { height: 0.70, diameter: 0.07, tessellation: 6 },
      position: { x:  0.20, y: -2.08, z: 0.30 },
      rotation: { x: 0.30, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // 6 – WAIST GUNS (staggered – B-17G; left fwd, right aft)
    { id: 'b17_waist_frame_l', shape: 'box',
      params:   { width: 0.08, height: 0.56, depth: 0.56 },
      position: { x: -1.22, y: 0.12, z: -2.80 },
      material: { color: '#3A4218', specular: '#333333' } },
    { id: 'b17_waist_glass_l', shape: 'box',
      params:   { width: 0.06, height: 0.48, depth: 0.48 },
      position: { x: -1.24, y: 0.12, z: -2.80 },
      material: { color: '#1A3A5C', alpha: 0.28 } },
    { id: 'b17_waist_gun_l', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.07, tessellation: 6 },
      position: { x: -1.56, y: 0.12, z: -2.80 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'b17_waist_frame_r', shape: 'box',
      params:   { width: 0.08, height: 0.56, depth: 0.56 },
      position: { x:  1.22, y: 0.12, z: -4.00 },
      material: { color: '#3A4218', specular: '#333333' } },
    { id: 'b17_waist_glass_r', shape: 'box',
      params:   { width: 0.06, height: 0.48, depth: 0.48 },
      position: { x:  1.24, y: 0.12, z: -4.00 },
      material: { color: '#1A3A5C', alpha: 0.28 } },
    { id: 'b17_waist_gun_r', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.07, tessellation: 6 },
      position: { x:  1.56, y: 0.12, z: -4.00 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // 7 – TAIL GUNS (Cheyenne modification – 2 × .50 cal + extended tail)
    { id: 'b17_tail_station', shape: 'cylinder',
      params:   { height: 0.80, diameter: 0.90, tessellation: 16 },
      position: { x: 0, y: 0.10, z: -11.60 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#333333', specular: '#555555' } },
    { id: 'b17_tail_glass', shape: 'cylinder',
      params:   { height: 0.55, diameterTop: 0.82, diameterBottom: 0.30, tessellation: 16 },
      position: { x: 0, y: 0.10, z: -12.12 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A3A5C', alpha: 0.34 } },
    { id: 'b17_tail_bar_l', shape: 'cylinder',
      params:   { height: 1.10, diameter: 0.07, tessellation: 6 },
      position: { x: -0.24, y: 0.10, z: -12.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },
    { id: 'b17_tail_bar_r', shape: 'cylinder',
      params:   { height: 1.10, diameter: 0.07, tessellation: 6 },
      position: { x:  0.24, y: 0.10, z: -12.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#1A1A1A', specular: '#888888' } },

    // ── BOMB BAY STRUCTURE (visible even when doors are closed) ───────────────
    // Structural rib frames on the bay sides
    { id: 'b17_bay_rib1', shape: 'box',
      params:   { width: 2.20, height: 0.10, depth: 0.12 },
      position: { x: 0, y: -0.90, z: 0.50 },
      material: { color: '#2A2A1A', specular: '#333333' } },
    { id: 'b17_bay_rib2', shape: 'box',
      params:   { width: 2.20, height: 0.10, depth: 0.12 },
      position: { x: 0, y: -0.90, z: 2.50 },
      material: { color: '#2A2A1A', specular: '#333333' } },
    { id: 'b17_bay_rib3', shape: 'box',
      params:   { width: 2.20, height: 0.10, depth: 0.12 },
      position: { x: 0, y: -0.90, z: 4.00 },
      material: { color: '#2A2A1A', specular: '#333333' } },
    // Bomb shapes (4 × 500 lb M64 bombs per side = 8 total, hanging from racks)
    { id: 'b17_bomb1', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x: -0.42, y: -1.14, z: 0.60 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb2', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x: -0.42, y: -1.14, z: 1.70 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb3', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x: -0.42, y: -1.14, z: 2.80 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb4', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x: -0.42, y: -1.14, z: 3.90 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb5', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x:  0.42, y: -1.14, z: 0.60 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb6', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x:  0.42, y: -1.14, z: 1.70 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb7', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x:  0.42, y: -1.14, z: 2.80 },
      material: { color: '#333322', specular: '#444433' } },
    { id: 'b17_bomb8', shape: 'cylinder',
      params:   { height: 0.90, diameter: 0.26, tessellation: 10 },
      position: { x:  0.42, y: -1.14, z: 3.90 },
      material: { color: '#333322', specular: '#444433' } },

    // ── TAIL ASSEMBLY ─────────────────────────────────────────────────────────
    // Single large vertical stabilizer (B-17's characteristic tall fin)
    { id: 'b17_vstab_lo', shape: 'box',
      params:   { width: 0.18, height: 2.20, depth: 2.90 },
      position: { x: 0, y: 2.26, z: -8.60 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },
    { id: 'b17_vstab_hi', shape: 'box',
      params:   { width: 0.16, height: 2.40, depth: 2.10 },
      position: { x: 0, y: 4.36, z: -9.00 },
      material: { color: '#455020', texture: 'b17_body', specular: '#333333' } },
    // Vertical fin leading-edge rounded cap
    { id: 'b17_vstab_cap', shape: 'cylinder',
      params:   { height: 0.20, diameterTop: 1.20, diameterBottom: 0.40, tessellation: 14 },
      position: { x: 0, y: 5.52, z: -9.20 },
      rotation: { x: 0, y: 0, z: 0 },
      material: { color: '#455020', texture: 'b17_body', specular: '#333333' } },
    // Rudder
    { id: 'b17_rudder', shape: 'box',
      params:   { width: 0.14, height: 3.90, depth: 1.05 },
      position: { x: 0, y: 3.00, z: -10.00 },
      material: { color: '#3A4218', specular: '#333333' } },
    // Horizontal stabilizers – LEFT (2 sections + tip)
    { id: 'b17_hstab_l_inr', shape: 'box',
      params:   { width: 3.20, height: 0.18, depth: 1.90 },
      position: { x: -2.00, y: 0.84, z: -8.60 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_hstab_l_out', shape: 'box',
      params:   { width: 3.00, height: 0.14, depth: 1.50 },
      position: { x: -5.10, y: 0.84, z: -8.80 },
      material: { color: '#455020', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_hstab_l_tip', shape: 'cylinder',
      params:   { height: 0.25, diameterTop: 1.50, diameterBottom: 0.45, tessellation: 16 },
      position: { x: -6.62, y: 0.84, z: -8.90 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#455020', specular: '#333333' } },
    // Left elevator + trim tab
    { id: 'b17_elev_l', shape: 'box',
      params:   { width: 4.60, height: 0.12, depth: 0.65 },
      position: { x: -3.20, y: 0.84, z: -9.65 },
      material: { color: '#3A4218', specular: '#333333' } },
    { id: 'b17_elev_l_tab', shape: 'box',
      params:   { width: 1.00, height: 0.09, depth: 0.24 },
      position: { x: -4.20, y: 0.84, z: -9.98 },
      material: { color: '#333818', specular: '#333333' } },
    // Horizontal stabilizers – RIGHT
    { id: 'b17_hstab_r_inr', shape: 'box',
      params:   { width: 3.20, height: 0.18, depth: 1.90 },
      position: { x:  2.00, y: 0.84, z: -8.60 },
      material: { color: '#4B5320', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_hstab_r_out', shape: 'box',
      params:   { width: 3.00, height: 0.14, depth: 1.50 },
      position: { x:  5.10, y: 0.84, z: -8.80 },
      material: { color: '#455020', texture: 'b17_wing', specular: '#333333' } },
    { id: 'b17_hstab_r_tip', shape: 'cylinder',
      params:   { height: 0.25, diameterTop: 1.50, diameterBottom: 0.45, tessellation: 16 },
      position: { x:  6.62, y: 0.84, z: -8.90 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#455020', specular: '#333333' } },
    { id: 'b17_elev_r', shape: 'box',
      params:   { width: 4.60, height: 0.12, depth: 0.65 },
      position: { x:  3.20, y: 0.84, z: -9.65 },
      material: { color: '#3A4218', specular: '#333333' } },
    { id: 'b17_elev_r_tab', shape: 'box',
      params:   { width: 1.00, height: 0.09, depth: 0.24 },
      position: { x:  4.20, y: 0.84, z: -9.98 },
      material: { color: '#333818', specular: '#333333' } },

    // ── LANDING GEAR ──────────────────────────────────────────────────────────
    // Main gear retracts into inboard engine nacelles.
    // LEFT main gear: oleo + torque-link + axle + tire + hub + gear doors
    { id: 'b17_gear_l_oleo', shape: 'cylinder',
      params:   { height: 1.20, diameter: 0.16, tessellation: 10 },
      position: { x: -2.00, y: -1.08, z: 2.10 },
      rotation: { x: 0, y: 0, z: 0.08 },
      material: { color: '#888888', specular: '#BBBBBB' } },
    { id: 'b17_gear_l_fork', shape: 'cylinder',
      params:   { height: 0.55, diameter: 0.12, tessellation: 10 },
      position: { x: -2.08, y: -1.68, z: 2.10 },
      rotation: { x: 0, y: 0, z: 0.06 },
      material: { color: '#666666', specular: '#999999' } },
    { id: 'b17_gear_l_axle', shape: 'cylinder',
      params:   { height: 0.38, diameter: 0.09, tessellation: 8 },
      position: { x: -2.22, y: -2.18, z: 2.10 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#777777', specular: '#AAAAAA' } },
    { id: 'b17_wheel_l_tire', shape: 'cylinder',
      params:   { height: 0.32, diameter: 0.90, tessellation: 20 },
      position: { x: -2.22, y: -2.18, z: 2.10 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#151515', texture: 'tire' } },
    { id: 'b17_wheel_l_hub', shape: 'cylinder',
      params:   { height: 0.34, diameter: 0.46, tessellation: 14 },
      position: { x: -2.22, y: -2.18, z: 2.10 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#777777', specular: '#BBBBBB' } },
    { id: 'b17_gear_door_l1', shape: 'box',
      params:   { width: 0.10, height: 1.00, depth: 0.65 },
      position: { x: -1.72, y: -0.90, z: 2.28 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },
    { id: 'b17_gear_door_l2', shape: 'box',
      params:   { width: 0.10, height: 1.00, depth: 0.65 },
      position: { x: -1.72, y: -0.90, z: 1.84 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },
    // RIGHT main gear (mirror)
    { id: 'b17_gear_r_oleo', shape: 'cylinder',
      params:   { height: 1.20, diameter: 0.16, tessellation: 10 },
      position: { x:  2.00, y: -1.08, z: 2.10 },
      rotation: { x: 0, y: 0, z: -0.08 },
      material: { color: '#888888', specular: '#BBBBBB' } },
    { id: 'b17_gear_r_fork', shape: 'cylinder',
      params:   { height: 0.55, diameter: 0.12, tessellation: 10 },
      position: { x:  2.08, y: -1.68, z: 2.10 },
      rotation: { x: 0, y: 0, z: -0.06 },
      material: { color: '#666666', specular: '#999999' } },
    { id: 'b17_gear_r_axle', shape: 'cylinder',
      params:   { height: 0.38, diameter: 0.09, tessellation: 8 },
      position: { x:  2.22, y: -2.18, z: 2.10 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#777777', specular: '#AAAAAA' } },
    { id: 'b17_wheel_r_tire', shape: 'cylinder',
      params:   { height: 0.32, diameter: 0.90, tessellation: 20 },
      position: { x:  2.22, y: -2.18, z: 2.10 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#151515', texture: 'tire' } },
    { id: 'b17_wheel_r_hub', shape: 'cylinder',
      params:   { height: 0.34, diameter: 0.46, tessellation: 14 },
      position: { x:  2.22, y: -2.18, z: 2.10 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#777777', specular: '#BBBBBB' } },
    { id: 'b17_gear_door_r1', shape: 'box',
      params:   { width: 0.10, height: 1.00, depth: 0.65 },
      position: { x:  1.72, y: -0.90, z: 2.28 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },
    { id: 'b17_gear_door_r2', shape: 'box',
      params:   { width: 0.10, height: 1.00, depth: 0.65 },
      position: { x:  1.72, y: -0.90, z: 1.84 },
      material: { color: '#4B5320', texture: 'b17_body', specular: '#333333' } },
    // Nose gear: steerable tailwheel type (B-17 is a taildragger)
    { id: 'b17_nose_strut', shape: 'cylinder',
      params:   { height: 1.10, diameter: 0.12, tessellation: 10 },
      position: { x: 0, y: -1.24, z: 7.60 },
      material: { color: '#777777', specular: '#AAAAAA' } },
    { id: 'b17_nose_wheel_tire', shape: 'cylinder',
      params:   { height: 0.26, diameter: 0.55, tessellation: 16 },
      position: { x: 0, y: -1.88, z: 7.60 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#151515', texture: 'tire' } },
    { id: 'b17_nose_wheel_hub', shape: 'cylinder',
      params:   { height: 0.28, diameter: 0.28, tessellation: 12 },
      position: { x: 0, y: -1.88, z: 7.60 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
      material: { color: '#777777', specular: '#AAAAAA' } },

    // ── SURFACE DETAILS ───────────────────────────────────────────────────────
    // USAAF national insignia – left wing upper
    { id: 'b17_insig_lw_bg', shape: 'box',
      params:   { width: 3.20, height: 0.01, depth: 1.80 },
      position: { x: -9.40, y: 1.00, z: 0.60 },
      material: { color: '#2456A4' } },
    { id: 'b17_insig_lw_star', shape: 'box',
      params:   { width: 1.90, height: 0.01, depth: 1.10 },
      position: { x: -9.40, y: 1.01, z: 0.60 },
      material: { color: '#FFFFFF' } },
    // Right wing lower
    { id: 'b17_insig_rw', shape: 'box',
      params:   { width: 3.20, height: 0.01, depth: 1.80 },
      position: { x:  9.40, y: 0.96, z: 0.60 },
      material: { color: '#2456A4' } },
    // Fuselage identification marking strip
    { id: 'b17_fuselage_stripe', shape: 'box',
      params:   { width: 0.04, height: 0.50, depth: 5.00 },
      position: { x: -1.26, y: 0.10, z: 3.00 },
      material: { color: '#FFD700' } },
    // Pitot tubes (left and right wing leading edges)
    { id: 'b17_pitot_l', shape: 'cylinder',
      params:   { height: 0.70, diameterTop: 0.028, diameterBottom: 0.05, tessellation: 6 },
      position: { x: -6.40, y: 0.90, z: 2.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#CCCCCC', specular: '#EEEEEE' } },
    { id: 'b17_pitot_r', shape: 'cylinder',
      params:   { height: 0.70, diameterTop: 0.028, diameterBottom: 0.05, tessellation: 6 },
      position: { x:  6.40, y: 0.90, z: 2.20 },
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      material: { color: '#CCCCCC', specular: '#EEEEEE' } },
    // Radio antenna mast
    { id: 'b17_antenna_mast', shape: 'box',
      params:   { width: 0.06, height: 0.55, depth: 0.08 },
      position: { x: 0, y: 1.30, z: 2.00 },
      material: { color: '#888888', specular: '#BBBBBB' } },
    { id: 'b17_antenna_wire', shape: 'box',
      params:   { width: 0.025, height: 0.05, depth: 5.50 },
      position: { x: 0, y: 1.78, z: -0.40 },
      rotation: { x: 0.08, y: 0, z: 0 },
      material: { color: '#666666' } },
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
