import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Settings } from '../app.settings';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

interface GameStructure {
  id:     number;
  name:   string;
  type:   'building' | 'tower' | 'hangar';
  x:      number;
  z:      number;
  width:  number;
  depth:  number;
  height: number;
}

interface GameHydrography {
  id:    number;
  name:  string;
  type:  'lake' | 'river';
  x:     number;
  z:     number;
  width: number;
  depth: number;
}

interface GameWeather {
  wind:          { x: number; z: number; speed: number };
  turbulence:    number;   // 0 (calm) – 1 (severe)
  fog:           { density: number };
  precipitation: 'rain' | 'none';
  description:   string;
}

interface TerrainTree {
  x:     number;
  z:     number;
  scale: number;
}

interface TerrainTile {
  id:          string;
  tileX:       number;
  tileZ:       number;
  worldX:      number;
  worldZ:      number;
  size:        number;
  resolution:  number;
  heights:     number[];
  groundCover: 'grassland' | 'forest' | 'farmland' | 'arid';
  trees:       TerrainTree[];
}

interface GameRoad {
  id:    string;
  x1:    number;
  z1:    number;
  x2:    number;
  z2:    number;
  width: number;
  type:  'highway' | 'local';
}

interface GameRunway {
  id:        string;
  heading:   number;  // degrees clockwise from world +Z axis (0 = N-S, 90 = E-W)
  length:    number;
  width:     number;
  x:         number;  // runway centre world X
  z:         number;  // runway centre world Z
  elevation: number;  // runway surface Y (world units)
}

interface GameAirport {
  id:       number;
  name:     string;
  code:     string;
  x:        number;
  z:        number;
  elevation: number;
  runways:  GameRunway[];
}

interface GameTown {
  id:   number;
  name: string;
  x:    number;
  z:    number;
}

interface PlanePart {
  id:        string;
  shape:     'box' | 'cylinder';
  params:    Record<string, number>;
  position:  { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  material:  { color: string; specular?: string; texture?: string; alpha?: number };
  isProp?:   boolean;
}

interface PlaneSummary {
  id:   number;
  name: string;
  slug: string;
}

interface GamePlanePhysics {
  stallSpeed:      number;
  liftK:           number;
  initialSpeed:    number;
  initialThrottle: number;
  dragK:           number;
  maxSpeed:        number;
  acceleration:    number;
  weight?:         number;  // gravity/lift scale — heavier planes drop harder in a stall
  cockpitCameraPos?: { x: number; y: number; z: number };
  groundOffset?:   number;
  rotSpeed?:       number;  // control rotation speed (rad/s)
  throttleRate?:   number;  // throttle ramp speed (0→1 per second)
  machineGunsEnabled?: boolean;
  gunPositions?: { x: number; y: number; z: number }[];
  bombBayEnabled?: boolean;
  bombPositions?: { x: number; y: number; z: number }[];
  retractableGear?: boolean;
}

interface GamePlane {
  id:    number;
  name:  string;
  slug:  string;
  parts: PlanePart[];
  cockpitParts?: PlanePart[];
  physics?: GamePlanePhysics;
}

import {
  // DebrisPiece uses Mesh and Vector3, so it is declared after this import
// ─────────────────────────────────────────────────────────────────────────
  Engine,
  Scene,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  DirectionalLight,
  MeshBuilder,
  StandardMaterial,
  DynamicTexture,
  ParticleSystem,
  ArcRotateCamera,
  FreeCamera,
  PointLight,
  Space,
  Axis,
  Mesh,
  Quaternion,
  PointerEventTypes,
  VertexData,
  TransformNode,
} from '@babylonjs/core';

interface DebrisPiece {
  mesh:            Mesh;
  velocity:        Vector3;   // world units/s
  angularVelocity: Vector3;   // rad/s on each local axis
}

interface TracerRound {
  mesh:              Mesh;
  velocity:          Vector3;  // world-space, units/s
  distanceTravelled: number;
}

interface Bomb {
  root:     TransformNode;   // parent node — rotating it orients all child parts
  meshes:   Mesh[];          // body, nose, fins — for explicit disposal
  velocity: Vector3;         // world-space, units/s
}

interface Explosion {
  fire:   ParticleSystem;
  smoke:  ParticleSystem;
  age:    number;            // seconds since detonation
  maxAge: number;            // when to stop fire emitter
}

interface OtherPlayer {
  root:      TransformNode;
  meshes:    Mesh[];
  label:     Mesh;
  callsign:  string;
  planeName: string;
  planeSlug: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-wrap">
      <canvas #gameCanvas></canvas>
      <div class="hud">
        <div class="hud-row">ALT &nbsp; {{ altitude | number:'1.0-0' }} m</div>
        <div class="hud-row">SPD &nbsp; {{ speed | number:'1.0-0' }} u/s</div>
        <div class="hud-row">THR &nbsp; {{ throttle * 100 | number:'1.0-0' }}%</div>
        <div class="hud-stall" *ngIf="stalling">&#9888; STALL</div>
        <div class="hud-bomb-bay" *ngIf="bombBayOpen">&#9673; BOMB BAY OPEN</div>
        <div class="hud-gear-up" *ngIf="retractableGear && !gearDown">&#9651; GEAR UP</div>
        <div class="hud-land" *ngIf="landingMsg">&#10003; {{ landingMsg }}</div>
        <div class="hud-gnd"  *ngIf="landed">GND &nbsp; {{ landedAt }}</div>
        <div class="hud-row hud-cam">CAM &nbsp; {{ cameraMode }}</div>
        <div class="hud-weather" *ngIf="weather">
          <div class="hud-row hud-wdesc">{{ weather.description }}</div>
          <div class="hud-row">WND {{ weather.wind.speed | number:'1.0-0' }} u/s</div>
          <div class="hud-row" *ngIf="weather.turbulence > 0.2">TURB {{ weather.turbulence | number:'1.1-1' }}</div>
        </div>
        <div class="hud-hint" *ngIf="!landed">
          W/S: Pitch &nbsp;|&nbsp; A/D: Roll &nbsp;|&nbsp; Q/E: Yaw
          &nbsp;|&nbsp; Shift: Throttle &#8593; &nbsp;|&nbsp; Ctrl: Throttle &#8595;
          <span *ngIf="machineGunsEnabled">&nbsp;|&nbsp; Space: &#128308; Fire</span>
          <span *ngIf="bombBayEnabled">&nbsp;|&nbsp; B: {{ bombBayOpen ? '&#128163; Drop Bomb' : '&#128682; Open Bay' }} &nbsp;|&nbsp; Esc: Close Bay</span>
          <span *ngIf="retractableGear">&nbsp;|&nbsp; G: {{ gearDown ? '&#8593; Retract Gear' : '&#8595; Lower Gear' }}</span>
          &nbsp;|&nbsp; V: Toggle Camera &nbsp;|&nbsp; P: Select Plane
          &nbsp;|&nbsp; <span *ngIf="cameraMode === '3rd Person'">Drag: Orbit camera</span>
        </div>
        <div class="hud-hint" *ngIf="landed">
          Shift: Throttle &#8593; &nbsp;|&nbsp; Auto-lifts off above {{ liftoffSpeed }} u/s
        </div>
      </div>
      <button class="plane-btn" (click)="planeSelectorOpen = !planeSelectorOpen">&#9992; {{ planeName }}</button>
      <button class="logout-btn" (click)="logout()">Logout</button>
      <div class="plane-selector-overlay" *ngIf="planeSelectorOpen">
        <div class="plane-selector-box">
          <div class="plane-selector-title">SELECT AIRCRAFT</div>
          <div class="plane-options">
            <div *ngFor="let p of availablePlanes"
                 class="plane-option"
                 [class.selected]="selectedPlaneSlug === p.slug"
                 (click)="selectPlane(p.slug)">
              <div class="plane-option-name">{{ p.name }}</div>
            </div>
          </div>
          <button class="plane-selector-close" (click)="planeSelectorOpen = false">CLOSE [P]</button>
        </div>
      </div>
      <div class="crash-overlay" *ngIf="crashBoxVisible">
        <div class="crash-box">
          <div class="crash-title">CRASHED</div>
          <div class="crash-msg">{{ crashMessage }}</div>
          <button class="restart-btn" (click)="restart()">FLY AGAIN</button>
        </div>
      </div>
      <canvas #minimapCanvas width="210" height="210" class="minimap"></canvas>
    </div>
  `,
  styles: [`
    .game-wrap {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hud {
      position: absolute;
      top: 16px;
      left: 16px;
      color: #fff;
      font-family: monospace;
      font-size: 13px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
      pointer-events: none;
      user-select: none;
    }
    .hud-hint {
      margin-top: 6px;
      color: rgba(255,255,255,0.55);
      font-size: 11px;
    }
    .hud-bomb-bay {
      font-size: 13px;
      font-weight: bold;
      color: #ffaa00;
      letter-spacing: 2px;
      animation: stall-blink 1.2s step-end infinite;
    }
    .hud-gear-up {
      font-size: 13px;
      font-weight: bold;
      color: #ff4444;
      letter-spacing: 2px;
      animation: stall-blink 1.2s step-end infinite;
    }
    .hud-stall {
      font-size: 13px;
      font-weight: bold;
      color: #ff8c00;
      letter-spacing: 3px;
      animation: stall-blink 0.65s step-end infinite;
    }
    @keyframes stall-blink { 50% { opacity: 0; } }
    .hud-land {
      font-size: 14px;
      font-weight: bold;
      color: #44ff88;
      letter-spacing: 3px;
      animation: stall-blink 0.7s step-end 4;
    }
    .hud-gnd {
      font-size: 12px;
      color: #44ff88;
      letter-spacing: 1px;
    }
    .hud-weather {
      margin-top: 6px;
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 5px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .hud-wdesc {
      font-weight: bold;
      letter-spacing: 1px;
      font-size: 12px;
    }
    .crash-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .crash-box {
      background: rgba(20,20,30,0.92);
      border: 1px solid rgba(255,80,80,0.6);
      border-radius: 8px;
      padding: 40px 60px;
      text-align: center;
      color: #fff;
      font-family: monospace;
    }
    .crash-title {
      font-size: 36px;
      font-weight: bold;
      color: #ff4444;
      letter-spacing: 4px;
      margin-bottom: 12px;
    }
    .crash-msg {
      font-size: 16px;
      color: rgba(255,255,255,0.7);
      margin-bottom: 28px;
    }
    .restart-btn {
      background: #ff4444;
      color: #fff;
      border: none;
      padding: 12px 32px;
      font-size: 14px;
      font-family: monospace;
      letter-spacing: 2px;
      border-radius: 4px;
      cursor: pointer;
    }
    .restart-btn:hover { background: #ff6666; }
    .logout-btn {
      position: absolute;
      top: 14px;
      right: 16px;
      background: rgba(0,0,0,0.45);
      color: rgba(255,255,255,0.75);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 5px 14px;
      font-size: 12px;
      font-family: monospace;
      letter-spacing: 1px;
      border-radius: 4px;
      cursor: pointer;
      z-index: 5;
      pointer-events: auto;
    }
    .logout-btn:hover { background: rgba(0,0,0,0.70); color: #fff; }
    .plane-btn {
      position: absolute;
      top: 14px;
      right: 90px;
      background: rgba(0,0,0,0.45);
      color: rgba(255,255,255,0.75);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 5px 14px;
      font-size: 12px;
      font-family: monospace;
      letter-spacing: 1px;
      border-radius: 4px;
      cursor: pointer;
      z-index: 5;
      pointer-events: auto;
    }
    .plane-btn:hover { background: rgba(0,0,0,0.70); color: #fff; }
    .plane-selector-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;
      pointer-events: auto;
    }
    .plane-selector-box {
      background: #111;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      padding: 28px 36px;
      min-width: 340px;
      text-align: center;
      font-family: monospace;
    }
    .plane-selector-title {
      color: #aaa;
      font-size: 11px;
      letter-spacing: 2px;
      margin-bottom: 18px;
    }
    .plane-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
    .plane-option {
      padding: 12px 20px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px;
      cursor: pointer;
      color: rgba(255,255,255,0.7);
      transition: background 0.15s, border-color 0.15s;
    }
    .plane-option:hover { background: rgba(255,255,255,0.07); }
    .plane-option.selected { border-color: #4fa; background: rgba(68,255,170,0.08); color: #4fa; }
    .plane-option-name { font-size: 14px; }
    .plane-selector-close {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.5);
      padding: 6px 18px;
      font-family: monospace;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
    }
    .plane-selector-close:hover { color: #fff; border-color: #fff; }
    .minimap {
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 210px;
      height: 210px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.25);
      pointer-events: none;
      user-select: none;
      z-index: 4;
      box-shadow: 0 2px 16px rgba(0,0,0,0.55);
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas',  { static: true }) canvasRef!:        ElementRef<HTMLCanvasElement>;
  @ViewChild('minimapCanvas', { static: true }) minimapCanvasRef!: ElementRef<HTMLCanvasElement>;

  private engine!: Engine;
  private scene!: Scene;
  private planeMesh!: Mesh;
  private orbitCamera!: ArcRotateCamera;
  private cockpitCamera!: FreeCamera;

  // ── Structures ────────────────────────────────────────────────────────────
  private structureMeshes = new Map<number, Mesh>();
  private lastFetchPos: Vector3 | null = null;
  private isFetchingStructures = false;
  private buildingMat!: StandardMaterial;
  private towerMat!: StandardMaterial;
  private hangarMat!: StandardMaterial;
  /** How far around the player (X/Z) to request structures */
  private readonly FETCH_RADIUS    = 3200;
  /** Re-fetch after the player moves this far from the last fetch point */
  private readonly REFETCH_DIST    = 1000;

  // ── Hydrography ──────────────────────────────────────────────────────
  private hydroMeshes      = new Map<number, Mesh>();
  private isFetchingHydro  = false;
  private waterMat!: StandardMaterial;

  // ── Terrain ──────────────────────────────────────────────────────────────
  private terrainMeshes        = new Map<string, Mesh>();
  private terrainTileData      = new Map<string, TerrainTile>();
  private treeMeshes           = new Map<string, Mesh[]>();
  private isFetchingTerrain    = false;
  private lastTerrainFetchPos: Vector3 | null = null;
  private grasslandMat!:       StandardMaterial;
  private forestMat!:          StandardMaterial;
  private farmMat!:            StandardMaterial;
  private aridMat!:            StandardMaterial;
  private treeMat!:            StandardMaterial;
  private readonly TERRAIN_FETCH_RADIUS = 6400;
  private readonly TERRAIN_REFETCH_DIST = 2000;

  // ── Roads ─────────────────────────────────────────────────────────────────
  private roadMeshes           = new Map<string, Mesh>();
  private isFetchingRoads      = false;
  private lastRoadFetchPos:    Vector3 | null = null;
  private highwayMat!:         StandardMaterial;
  private localRoadMat!:       StandardMaterial;
  private readonly ROAD_FETCH_RADIUS  = 3200;
  private readonly ROAD_REFETCH_DIST  = 1000;

  // ── Airports ───────────────────────────────────────────────────────────────
  private airports: GameAirport[] = [];
  private airportMeshes = new Map<number, Mesh[]>();
  private isFetchingAirports = false;
  private runwaySurfaceMat!: StandardMaterial;
  private runwayThresholdMat!: StandardMaterial;
  private airportBeaconMat!: StandardMaterial;

  // ── Minimap ───────────────────────────────────────────────────────────────
  private towns: GameTown[] = [];
  private minimapTimer = 0;
  private readonly MINIMAP_UPDATE_INTERVAL = 0.05; // 20 Hz
  private readonly MINIMAP_RANGE           = 8000; // world units visible within map radius

  // ── Multiplayer ───────────────────────────────────────────────────────────
  private multiWs: WebSocket | null = null;
  private myWsId    = '';
  private myCallsign = '';
  private otherPlayers = new Map<string, OtherPlayer>();
  private wsBroadcastTimer = 0;
  private readonly WS_BROADCAST_INTERVAL = 0.1; // 10 Hz
  private otherPlayerMat!: StandardMaterial;

  // ── Weapons ───────────────────────────────────────────────────────────────
  machineGunsEnabled = false;
  private gunPositions: { x: number; y: number; z: number }[] = [];
  private tracerRounds: TracerRound[] = [];
  private tracerFireTimer   = 0;
  private readonly TRACER_SPEED         = 800;  // units/s muzzle velocity
  private readonly TRACER_MAX_RANGE     = 600;  // units before tracer expires
  private readonly TRACER_FIRE_INTERVAL = 0.08; // seconds between salvos (~12 Hz)
  private readonly TRACER_BULLET_GRAVITY = 25;  // world-Y deceleration (units/s²) — creates bullet arc
  private tracerMat!: StandardMaterial;

  // ── Bomb bay ──────────────────────────────────────────────────────────────
  bombBayEnabled = false;   // public — read by template
  bombBayOpen    = false;   // public — drives HUD indicator
  private bombPositions:    { x: number; y: number; z: number }[] = [];
  private bombDoorPivots:   TransformNode[] = []; // [leftPivot, rightPivot]
  private bombDoorMeshes:   Mesh[]          = []; // [leftDoor,  rightDoor]
  private bombBayAngle      = 0;                  // 0 = closed, Math.PI/2 = fully open
  private readonly BOMB_DOOR_SPEED = 2.2;         // rad/s door animation
  private bombs:            Bomb[]          = [];
  private explosions:       Explosion[]     = [];
  private readonly BOMB_GRAVITY            = 14;  // units/s² — heavier fall than a bullet
  private readonly EXPLOSION_FIRE_DURATION = 8;   // seconds before fire stops emitting
  private bombMat!:         StandardMaterial;
  private bombDoorMat!:     StandardMaterial;
  private nextBombPos       = 0;                  // cycles through bombPositions[]

  // ── Landing gear ───────────────────────────────────────────────────────────
  retractableGear           = false;              // true for non-Cessna planes
  gearDown                  = true;               // exposed for HUD *ngIf
  private gearMeshes:        Mesh[]    = [];
  private gearOriginalPositions: Vector3[] = [];
  private gearAnimProgress  = 0;                  // 0 = extended, 1 = retracted
  private gearAnimTarget    = 0;
  private readonly GEAR_ANIM_SPEED   = 0.75;      // progress/s → ~1.3 s full travel
  private readonly GEAR_RETRACT_LIFT = 2.8;        // local-Y offset when retracted

  // ── Ground / landing state ─────────────────────────────────────────────────
  landed         = true;    // plane starts on the ground at XCTR-18
  landedAt       = '';      // airport name shown in HUD
  landingMsg     = '';      // flash message after touchdown
  private landingMsgTimer = 0;
  private liftoffGraceTimer = 0; // skip building checks briefly after takeoff

  private keys = new Set<string>();
  private boundKeyDown!: (e: KeyboardEvent) => void;
  private boundKeyUp!: (e: KeyboardEvent) => void;
  private boundResize!: () => void;

  speed        = 0;
  altitude     = 0;
  throttle     = 0;     // 0.0 (idle) – 1.0 (full); persists between frames
  cameraMode   = '3rd Person';
  crashed          = false;
  crashMessage     = '';
  crashBoxVisible  = false;
  stalling         = false;

  private INITIAL_SPEED    = 0;    // ground start — zero speed on runway
  private INITIAL_THROTTLE = 0.0;  // player must throttle up to take off
  private ACCELERATION     = 60;   // max thrust force (units/s²)
  private THROTTLE_RATE             = 0.40; // throttle change per second — overridden per-plane
  private DRAG_K           = 0.12; // drag deceleration = DRAG_K × speed (m/s²), opposing velocity
  private MAX_SPEED        = 400;  // units/s
  private ROT_SPEED        = 1.4;  // max rotation rate (rad/s) — overridden per-plane
  private ROT_DAMPING      = 4.0;  // aerodynamic damping (higher = stops faster on release)

  // ── Flight physics — Cessna 172 rough approximation ─────────────────────
  // Level flight (lift = gravity) at cruise ≈ 250 u/s.
  // Stall ≈ 125 u/s  (C172 stall:cruise ratio ≈ 50%).
  // Banking reduces the world-Y lift component naturally.
  private readonly GRAVITY      = 10;       // world-Y gravity        (units/s²)
  private LIFT_K       = 0.00016;  // lift = LIFT_K × CL × v², balanced @ 250 u/s with CL = 1
  private STALL_SPEED  = 125;      // minimum safe airspeed (below this → stall warning on HUD)
  private WEIGHT       = 1.0;      // per-plane gravity/lift multiplier (1 = Cessna baseline)
  private GROUND_OFFSET = 1.60;    // plane-center height above ground surface (Cessna default)

  // World-space velocity vector — replaces the scalar speed + physicsVY decomposition.
  // All aerodynamic forces (thrust, drag, lift, gravity) act on this vector directly,
  // enabling physically correct 3D flight including banked turns, inverted flight,
  // realistic stall recovery, and proper gravity in dives.
  private velocity = new Vector3(0, 0, 0);

  // Angular velocity for rotational inertia — components are rad/s on the
  // aircraft's local axes: x = pitch, z = roll, y = yaw.
  // Input accelerates angular velocity toward ±ROT_SPEED; aerodynamic damping
  // decays it to zero when controls are released so the aircraft carries its
  // rotation briefly, like a real aircraft would.
  private rotVelocity = new Vector3(0, 0, 0);

  // AoA-based lift coefficient model.
  // CL is normalised so that CL = 1.0 when the nose is aligned with the velocity
  // vector (AoA = 0°), which preserves all existing per-plane liftK tuning.
  // CL rises linearly with nose-up AoA up to the stall angle, then drops sharply.
  private readonly CL_ALPHA       = 2.5;   // lift slope (per radian of AoA)
  private readonly CL_STALL_ONSET = 0.20;  // AoA (rad, ~11.5°) where stall starts; CL peaks here
  private readonly CL_MIN         = 0.15;  // post-stall / negative-AoA floor

  // ── Weather ───────────────────────────────────────────────────────────────
  weather:                GameWeather | null = null;
  private rainSystem:     ParticleSystem | null = null;
  private weatherRefreshId: number | null = null;

  // ── Plane (server-driven geometry) ───────────────────────────────────────
  private planeParts:   Mesh[] = [];
  private cockpitParts: Mesh[] = [];
  private propMeshes:   Mesh[] = [];
  private planeTexCache = new Map<string, DynamicTexture>();
  private cockpitLight: PointLight | null = null;

  // ── Plane selection ───────────────────────────────────────────────────────
  planeName          = 'Cessna 172 Skyhawk';
  planeSelectorOpen  = false;
  selectedPlaneSlug  = 'cessna-172';
  availablePlanes:   PlaneSummary[] = [];

  // ── Cockpit look-around ───────────────────────────────────────────────────
  // Accumulated mouse-drag rotation offsets in planeMesh-local space.
  private cockpitLookH      = 0;   // yaw   (rad) — ±π/2
  private cockpitLookV      = 0;   // pitch (rad) — −0.5…+0.8
  private isCockpitDragging = false;
  private cockpitDragLastX  = 0;
  private cockpitDragLastY  = 0;
  private boundPointerUp!:  () => void;

  // ── Crash / debris ───────────────────────────────────────────────────────
  private debrisPieces: DebrisPiece[]        = [];
  private fireSystem:   ParticleSystem | null = null;
  private smokeSystem:  ParticleSystem | null = null;

  constructor(private ngZone: NgZone, private _router: Router,
              private _auth: AuthService, private _user: UserService) {}

  ngOnInit(): void {
    this.initEngine();
  }

  private initEngine(): void {
    const canvas = this.canvasRef.nativeElement;

    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
    this.scene  = this.buildScene();

    this.boundKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') e.preventDefault(); // prevent page scroll
      this.keys.add(e.key);
    };
    this.boundKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.key);
      if (e.key === 'v' || e.key === 'V') {
        this.toggleCamera();
      }
      if (e.key === 'p' || e.key === 'P') {
        this.ngZone.run(() => { this.planeSelectorOpen = !this.planeSelectorOpen; });
      }
      // Bomb bay — B opens/drops, Escape closes
      if ((e.key === 'b' || e.key === 'B') && this.bombBayEnabled) {
        this.ngZone.run(() => {
          if (!this.bombBayOpen) {
            this.bombBayOpen = true;
          } else {
            this.dropBomb();
          }
        });
      }
      if (e.key === 'Escape' && this.bombBayOpen) {
        this.ngZone.run(() => { this.bombBayOpen = false; });
      }
      if ((e.key === 'g' || e.key === 'G') && this.retractableGear) {
        this.ngZone.run(() => {
          this.gearDown        = !this.gearDown;
          this.gearAnimTarget  = this.gearDown ? 0 : 1;
        });
      }
    };
    this.boundResize = () => this.engine.resize();

    // Cockpit look-around — registered on BabylonJS's scene pointer observable
    // so it fires from the same pointer event chain the engine uses (avoids
    // BabylonJS calling preventDefault() on canvas pointer events which would
    // block window mousedown/mousemove from ever firing).
    // A window 'pointerup' catches releases outside the canvas.
    this.boundPointerUp = () => { this.isCockpitDragging = false; };

    window.addEventListener('keydown',   this.boundKeyDown);
    window.addEventListener('keyup',     this.boundKeyUp);
    window.addEventListener('resize',    this.boundResize);
    window.addEventListener('pointerup', this.boundPointerUp);

    this.engine.runRenderLoop(() => {
      this.gameLoop();
      this.scene.render();
    });

    // Poll weather every 30 seconds so conditions evolve while flying
    this.weatherRefreshId = window.setInterval(() => this.fetchWeather(), 30_000);
  }

  private buildScene(): Scene {
    const scene = new Scene(this.engine);

    // Sky colour
    scene.clearColor = new Color4(0.22, 0.52, 0.90, 1);

    // Atmospheric fog — density is updated when weather arrives
    scene.fogMode    = Scene.FOGMODE_EXP2;
    scene.fogColor   = new Color3(0.38, 0.62, 0.88); // haze matches sky
    scene.fogDensity = 0.00008;                       // light default

    // Ambient light from above
    const light = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    // Sun — directional light + visible sphere far in the sky
    // Direction: from sun position (3000, 2200, 4000) toward origin
    const sunLight = new DirectionalLight(
      'sunLight',
      new Vector3(-3000, -2200, -4000),
      scene
    );
    sunLight.intensity = 0.9;

    const sunSphere = MeshBuilder.CreateSphere('sun', { diameter: 240, segments: 10 }, scene);
    sunSphere.position  = new Vector3(3000, 2200, 4000);
    sunSphere.isPickable = false;
    const sunMat = new StandardMaterial('sunMat', scene);
    sunMat.emissiveColor    = new Color3(1.0, 0.92, 0.55);
    sunMat.disableLighting  = true;
    sunSphere.material = sunMat;

    // Grassland terrain-tile material (shared across all grassland tiles)
    this.grasslandMat = new StandardMaterial('grasslandMat', scene);
    const grassTex    = this.createGrassTexture(scene);
    grassTex.uScale   = 24;
    grassTex.vScale   = 24;
    this.grasslandMat.diffuseTexture = grassTex;

    // ── Plane root (invisible collision hull) ────────────────────────────────
    // planeMesh is an invisible bounding box used for physics, collision and
    // camera targeting.  Visual parts are loaded async from /api/planes/default
    // and attached as children with layerMask = 0x10000000 so the cockpit
    // camera (default layer) never sees the airframe.
    this.planeMesh = MeshBuilder.CreateBox('planeMesh', {
      width: 1.55, height: 1.25, depth: 8.5,
    }, scene);
    this.planeMesh.isVisible = false;
    // Spawn at south end of XCTR-18 (heading 0, length 2000, center z=0)
    this.planeMesh.position  = new Vector3(0, 1.60, -900);

    const storedSlug = localStorage.getItem('selectedPlane');
    if (storedSlug) this.selectedPlaneSlug = storedSlug;
    this.fetchPlane(this.selectedPlaneSlug !== 'cessna-172' ? this.selectedPlaneSlug : undefined);
    this.fetchPlanes();

    // ── Third-person orbit camera (default) — mouse drag to orbit ──────────
    // alpha = -π/2 places camera behind plane (+Z facing); beta = π/3 tilts down
    this.orbitCamera = new ArcRotateCamera(
      'orbitCam', -Math.PI / 2, Math.PI / 3, 40,
      this.planeMesh.position.clone(), scene
    );
    this.orbitCamera.lowerRadiusLimit = 8;
    this.orbitCamera.upperRadiusLimit = 200;
    this.orbitCamera.lowerBetaLimit   = 0.05;          // prevent flipping overhead
    this.orbitCamera.upperBetaLimit   = Math.PI / 2.1; // stop going below horizon
    this.orbitCamera.attachControl(this.canvasRef.nativeElement, true); // enable mouse drag
    this.orbitCamera.layerMask = 0x0FFFFFFF | 0x10000000; // sees default + plane layer

    // ── First-person cockpit camera ────────────────────────────────────────
    // Parented to the plane — inherits all rotations/translations.
    // layerMask is default (0x0FFFFFFF): does NOT include the plane layer,
    // so the airframe is invisible and the view is an unobstructed horizon.
    this.cockpitCamera = new FreeCamera('cockpitCam', new Vector3(0, 0.44, 3.2), scene);
    this.cockpitCamera.parent    = this.planeMesh;
    this.cockpitCamera.minZ      = 0.1;  // tight near-clip so close terrain/buildings don't vanish
    this.cockpitCamera.fov       = 1.1;  // ~63° vertical — wide cockpit view so panel fits in frame
    // Cockpit layer 0x20000000 contains interior geometry; orbit camera mask
    // (0x1FFFFFFF) does NOT overlap with 0x20000000 so interior stays invisible
    // in third-person. Exterior parts (0x10000000) don't overlap with this
    // mask either, keeping the airframe invisible from inside the cockpit.
    this.cockpitCamera.layerMask = 0x0FFFFFFF | 0x20000000; // 0x2FFFFFFF

    // Cockpit interior point light — warm glow to illuminate the instrument
    // panel and walls.  Parented to planeMesh so it travels with the aircraft.
    // includedOnlyMeshes is populated in buildPlaneFromData so it never leaks
    // onto the exterior or world geometry in third-person view.
    const ckLight     = new PointLight('cockpitPtLight', Vector3.Zero(), scene);
    ckLight.parent    = this.planeMesh;
    ckLight.position  = new Vector3(0, 0.72, 3.5);   // above & forward of camera
    ckLight.diffuse   = new Color3(1.0, 0.92, 0.75); // warm amber-white
    ckLight.intensity = 1.0;
    ckLight.range     = 3.0;
    this.cockpitLight = ckLight;

    scene.activeCamera = this.orbitCamera;

    // ── Structure materials (shared across all meshes of each type) ─────────
    this.buildingMat = new StandardMaterial('buildingMat', scene);
    this.buildingMat.diffuseTexture = this.createBuildingWindowTexture(scene);

    this.towerMat = new StandardMaterial('towerMat', scene);
    this.towerMat.diffuseTexture = this.createTowerWindowTexture(scene);

    this.hangarMat = new StandardMaterial('hangarMat', scene);
    this.hangarMat.diffuseTexture = this.createHangarTexture(scene);

    // ── Water material (shared by all hydrography features) ──────────────
    this.waterMat = new StandardMaterial('waterMat', scene);
    this.waterMat.diffuseColor  = new Color3(0.10, 0.38, 0.72);
    this.waterMat.specularColor = new Color3(0.85, 0.92, 1.00);
    this.waterMat.specularPower = 64;
    this.waterMat.alpha         = 0.78;

    // ── Terrain biome materials ──────────────────────────────────────────────
    this.forestMat = new StandardMaterial('forestMat', scene);
    this.forestMat.diffuseTexture = this.createForestTexture(scene);
    (this.forestMat.diffuseTexture as DynamicTexture).uScale = 24;
    (this.forestMat.diffuseTexture as DynamicTexture).vScale = 24;

    this.farmMat = new StandardMaterial('farmMat', scene);
    this.farmMat.diffuseTexture = this.createFarmTexture(scene);
    (this.farmMat.diffuseTexture as DynamicTexture).uScale = 16;
    (this.farmMat.diffuseTexture as DynamicTexture).vScale = 16;

    this.aridMat = new StandardMaterial('aridMat', scene);
    this.aridMat.diffuseTexture = this.createAridTexture(scene);
    (this.aridMat.diffuseTexture as DynamicTexture).uScale = 24;
    (this.aridMat.diffuseTexture as DynamicTexture).vScale = 24;

    // ── Tree material (shared by all procedural tree cones) ──────────────
    this.treeMat = new StandardMaterial('treeMat', scene);
    this.treeMat.diffuseColor  = new Color3(0.14, 0.38, 0.14);
    this.treeMat.specularColor = new Color3(0.05, 0.10, 0.05);

    // ── Road materials ────────────────────────────────────────────────────
    this.highwayMat = new StandardMaterial('highwayMat', scene);
    this.highwayMat.diffuseColor  = new Color3(0.20, 0.20, 0.20);
    this.highwayMat.specularColor = Color3.Black();

    this.localRoadMat = new StandardMaterial('localRoadMat', scene);
    this.localRoadMat.diffuseColor  = new Color3(0.42, 0.40, 0.36);
    this.localRoadMat.specularColor = Color3.Black();

    // ── Other-player silhouette material (bright orange, visible at a glance) ──
    this.otherPlayerMat = new StandardMaterial('otherPlayerMat', scene);
    this.otherPlayerMat.diffuseColor  = new Color3(1.0, 0.45, 0.0);
    this.otherPlayerMat.emissiveColor = new Color3(0.4, 0.18, 0.0);
    this.otherPlayerMat.specularColor = Color3.Black();

    // ── Tracer-round material (bright yellow-white with orange glow) ──────────
    this.tracerMat = new StandardMaterial('tracerMat', scene);
    this.tracerMat.diffuseColor  = new Color3(1.0, 0.95, 0.5);
    this.tracerMat.emissiveColor = new Color3(1.0, 0.6,  0.1);
    this.tracerMat.specularColor = Color3.Black();

    // ── Bomb / bomb-bay-door material (olive drab) ────────────────────────────
    this.bombMat = new StandardMaterial('bombMat', scene);
    this.bombMat.diffuseColor  = new Color3(0.22, 0.24, 0.16);
    this.bombMat.specularColor = new Color3(0.08, 0.08, 0.08);

    this.bombDoorMat = new StandardMaterial('bombDoorMat', scene);
    this.bombDoorMat.diffuseColor  = new Color3(0.29, 0.33, 0.20); // slightly lighter B-17 green
    this.bombDoorMat.specularColor = new Color3(0.10, 0.10, 0.10);

    // ── Rain particle system (activated by weather when precipitation = 'rain') ────
    const dropTex = new DynamicTexture('rainDrop', { width: 4, height: 16 }, scene, false);
    const dCtx    = dropTex.getContext();
    dCtx.fillStyle = 'rgba(185, 218, 255, 0.92)';
    dCtx.fillRect(0, 0, 4, 16);
    dropTex.update();

    this.rainSystem = new ParticleSystem('rain', 1500, scene);
    this.rainSystem.particleTexture = dropTex;
    this.rainSystem.emitter         = this.planeMesh;
    this.rainSystem.minEmitBox      = new Vector3(-100, 45, -100);
    this.rainSystem.maxEmitBox      = new Vector3( 100, 55,  100);
    this.rainSystem.direction1      = new Vector3(-4, -28, -4);
    this.rainSystem.direction2      = new Vector3( 4, -22,  4);
    this.rainSystem.minLifeTime     = 0.4;
    this.rainSystem.maxLifeTime     = 0.9;
    this.rainSystem.emitRate        = 700;
    this.rainSystem.minSize         = 0.15;
    this.rainSystem.maxSize         = 0.35;
    this.rainSystem.color1          = new Color4(0.7, 0.85, 1.0, 0.7);
    this.rainSystem.color2          = new Color4(0.6, 0.75, 1.0, 0.4);
    this.rainSystem.colorDead       = new Color4(0.5, 0.70, 1.0, 0.0);
    // Do not start yet — fetchWeather will enable it if precipitation = 'rain'

    // Initial structure load
    this.fetchStructures();
    // Load water features once at startup (they're static world geometry)
    this.fetchHydrography();
    // Fetch initial weather and begin 30-second polling cycle
    this.fetchWeather();
    // Initial terrain tiles + road network
    this.fetchTerrain();
    this.fetchRoads();
    // Airports are static — load once at startup
    this.fetchAirports();
    // Towns are static — load once at startup
    this.fetchTowns();

    // Multiplayer — connect WebSocket after scene is ready
    this.myCallsign = this.generateCallsign();
    this.initMultiplayer();

    // Cockpit look-around via BabylonJS pointer observable. Using the scene
    // observable (not window mousedown/mousemove) ensures this fires even when
    // BabylonJS calls preventDefault() on canvas pointer events.
    scene.onPointerObservable.add((info) => {
      if (this.scene.activeCamera !== this.cockpitCamera) return;
      const e = info.event;
      if (info.type === PointerEventTypes.POINTERDOWN && e.button === 0) {
        this.isCockpitDragging = true;
        this.cockpitDragLastX  = e.clientX;
        this.cockpitDragLastY  = e.clientY;
      } else if (info.type === PointerEventTypes.POINTERMOVE && this.isCockpitDragging) {
        const sens = 0.004;
        this.cockpitLookH = Math.max(-Math.PI / 2, Math.min(Math.PI / 2,
          this.cockpitLookH + (e.clientX - this.cockpitDragLastX) * sens));
        this.cockpitLookV = Math.max(-0.50, Math.min(0.80,
          this.cockpitLookV + (e.clientY - this.cockpitDragLastY) * sens));
        this.cockpitDragLastX = e.clientX;
        this.cockpitDragLastY = e.clientY;
      } else if (info.type === PointerEventTypes.POINTERUP) {
        this.isCockpitDragging = false;
      }
    });

    return scene;
  }

  private gameLoop(): void {
    const dt      = this.engine.getDeltaTime() / 1000; // seconds
    // Debris, tracers, bombs and explosions continue even after a crash
    if (this.debrisPieces.length > 0) this.updateDebris(dt);
    if (this.tracerRounds.length > 0) this.updateTracers(dt);
    if (this.bombs.length       > 0) this.updateBombs(dt);
    if (this.explosions.length  > 0) this.updateExplosions(dt);
    // Bomb bay door animation also runs post-crash so doors don't snap shut
    if (this.bombBayEnabled) this.animateBombBayDoors(dt);
    if (this.retractableGear) this.updateGear(dt);
    if (this.crashed) return;

    // ── Rotational inertia ────────────────────────────────────────────────────
    // Input accelerates angular velocity toward the plane's max rotation rate.
    // When no input is held, aerodynamic damping decays rotation back to zero.
    // This gives realistic carry-through: the aircraft keeps rotating briefly
    // after releasing the stick, and a counter-input is needed to stop a roll.
    const rotAccel = this.ROT_SPEED * 5.0;  // reach max rate in ~0.2 s

    // Pitch (X axis)
    if (this.keys.has('w') || this.keys.has('W')) {
      this.rotVelocity.x = Math.min( this.ROT_SPEED, this.rotVelocity.x + rotAccel * dt);
    } else if (this.keys.has('s') || this.keys.has('S')) {
      this.rotVelocity.x = Math.max(-this.ROT_SPEED, this.rotVelocity.x - rotAccel * dt);
    }

    // Roll (Z axis)
    if (this.keys.has('a') || this.keys.has('A')) {
      this.rotVelocity.z = Math.min( this.ROT_SPEED, this.rotVelocity.z + rotAccel * dt);
    } else if (this.keys.has('d') || this.keys.has('D')) {
      this.rotVelocity.z = Math.max(-this.ROT_SPEED, this.rotVelocity.z - rotAccel * dt);
    }

    // Yaw (Y axis)
    if (this.keys.has('q') || this.keys.has('Q')) {
      this.rotVelocity.y = Math.max(-this.ROT_SPEED, this.rotVelocity.y - rotAccel * dt);
    } else if (this.keys.has('e') || this.keys.has('E')) {
      this.rotVelocity.y = Math.min( this.ROT_SPEED, this.rotVelocity.y + rotAccel * dt);
    }

    // Aerodynamic damping — decays rotation when no input (or opposing input
    // is not yet held). The damping coefficient scales with airspeed so faster
    // flight gives crisper control response and tighter handling.
    const speedDamp  = 1.0 + this.speed * 0.002;       // gentle speed scaling
    const dampFactor = Math.max(0, 1 - this.ROT_DAMPING * speedDamp * dt);
    this.rotVelocity.scaleInPlace(dampFactor);

    // Apply angular velocity to the mesh
    if (Math.abs(this.rotVelocity.x) > 0.0001)
      this.planeMesh.rotate(Axis.X, this.rotVelocity.x * dt, Space.LOCAL);
    if (Math.abs(this.rotVelocity.z) > 0.0001)
      this.planeMesh.rotate(Axis.Z, this.rotVelocity.z * dt, Space.LOCAL);
    if (Math.abs(this.rotVelocity.y) > 0.0001)
      this.planeMesh.rotate(Axis.Y, this.rotVelocity.y * dt, Space.LOCAL);

    // Throttle — Shift ramps up, Control ramps down; setting persists between frames
    if (this.keys.has('Shift')) {
      this.throttle = Math.min(1, this.throttle + this.THROTTLE_RATE * dt);
    }
    if (this.keys.has('Control')) {
      this.throttle = Math.max(0, this.throttle - this.THROTTLE_RATE * dt);
    }

    // Machine guns — Space fires when airborne (P-51 only for now)
    if (this.machineGunsEnabled && this.keys.has(' ') && !this.landed) {
      this.tracerFireTimer -= dt;
      if (this.tracerFireTimer <= 0) {
        this.tracerFireTimer = this.TRACER_FIRE_INTERVAL;
        this.fireGuns();
      }
    } else {
      this.tracerFireTimer = 0; // reset so next press fires immediately
    }

    // ── Physics engine ───────────────────────────────────────────────────────
    // Uses a world-space velocity vector so all forces (thrust, drag, gravity,
    // lift) act in 3D. This fixes gravity in dives/climbs and enables proper
    // banked turns, energy management, and AoA-based lift coefficient.

    const fwd   = this.planeMesh.getDirection(Axis.Z);   // nose direction
    const up    = this.planeMesh.getDirection(Axis.Y);   // wing-up direction
    const right = this.planeMesh.getDirection(Axis.X);   // right-wing direction
    const speed = this.velocity.length();
    const velNorm = speed > 0.5 ? this.velocity.scale(1 / speed) : fwd.clone();

    // Angle of Attack: pitch angle of nose minus pitch angle of the velocity
    // vector (flight path angle). Positive = nose above flight path (lift-generating).
    const nosePitch = Math.asin(Math.max(-1, Math.min(1, fwd.y)));
    const velPitch  = Math.asin(Math.max(-1, Math.min(1, velNorm.y)));
    const AoA       = nosePitch - velPitch;

    // Lift Coefficient — normalised to CL = 1.0 at AoA = 0 (preserves existing
    // per-plane liftK tuning). Rises with AoA up to stall, then drops sharply.
    let CL: number;
    if (AoA < -0.15) {
      CL = this.CL_MIN;                                           // well below zero-lift angle
    } else if (AoA <= this.CL_STALL_ONSET) {
      CL = Math.max(this.CL_MIN, 1.0 + this.CL_ALPHA * AoA);    // linear lift slope
    } else {
      // Post-stall: linear drop from peak CL back to CL_MIN over 0.15 rad
      const peakCL   = 1.0 + this.CL_ALPHA * this.CL_STALL_ONSET;
      const progress = Math.min(1.0, (AoA - this.CL_STALL_ONSET) / 0.15);
      CL = Math.max(this.CL_MIN, peakCL + (this.CL_MIN - peakCL) * progress);
    }

    // Lift direction: perpendicular to velocity and to the wing span.
    // When banked, lift tilts with the aircraft, reducing the vertical component
    // and producing centripetal force for coordinated turns automatically.
    let liftDir: Vector3;
    if (speed > 0.5) {
      const ld = Vector3.Cross(velNorm, right);
      liftDir = ld.length() > 0.001 ? ld.normalize() : up.clone();
    } else {
      liftDir = up.clone();
    }

    if (this.landed) {
      // ── Ground roll ────────────────────────────────────────────────────────
      // On the ground, only thrust and drag act; gravity is absorbed by the
      // runway surface. Velocity stays aligned with the nose direction.
      const thrustAccel = this.ACCELERATION * this.throttle;
      const dragAccel   = this.DRAG_K * speed;
      const groundSpeed = Math.max(0, Math.min(speed + (thrustAccel - dragAccel) * dt, this.MAX_SPEED));
      this.velocity = fwd.scale(groundSpeed);

      this.planeMesh.position.addInPlace(this.velocity.scale(dt));
      const groundY = Math.max(
        this.getTerrainHeightAt(this.planeMesh.position.x, this.planeMesh.position.z), 0);
      this.planeMesh.position.y = groundY + this.GROUND_OFFSET;

      // Auto-liftoff: as soon as lift force exceeds weight, break ground contact.
      if (this.LIFT_K * this.WEIGHT * groundSpeed * groundSpeed > this.GRAVITY * this.WEIGHT) {
        this.landed = false;
        this.liftoffGraceTimer = 3.0;  // 3 s before building collisions re-enable
        this.ngZone.run(() => { this.landedAt = ''; });
      }
    } else {
      // ── Airborne flight ────────────────────────────────────────────────────
      // 1. Thrust — along nose direction
      this.velocity.addInPlace(fwd.scale(this.ACCELERATION * this.throttle * dt));
      // 2. Drag — opposing velocity, linear in airspeed (preserves existing tuning)
      this.velocity.addInPlace(velNorm.scale(-this.DRAG_K * speed * dt));
      // 3. Gravity — world -Y always pulling the aircraft down
      this.velocity.y -= this.GRAVITY * this.WEIGHT * dt;
      // 4. Lift — perpendicular to velocity, scaled by AoA-dependent CL
      const liftAccel = this.LIFT_K * CL * speed * speed;
      this.velocity.addInPlace(liftDir.scale(liftAccel * dt));

      // ── Directional stability (weathervane effect) ───────────────────────
      // The fuselage and tail surfaces keep the aircraft aligned with its heading.
      // Horizontal (X/Z) velocity is blended toward the nose heading direction
      // so the aircraft cannot sideslip or fly backwards during fast turns.
      // Vertical velocity is left untouched so gravity and lift work correctly.
      //
      // Rate scales with airspeed — a faster aircraft has stronger aerodynamic
      // restoring forces (larger dynamic pressure on the tail surfaces).
      const fwdH    = new Vector3(fwd.x, 0, fwd.z);
      const fwdHLen = fwdH.length();
      const velHorizSpd = Math.sqrt(this.velocity.x * this.velocity.x +
                                    this.velocity.z * this.velocity.z);
      if (fwdHLen > 0.10 && velHorizSpd > 0.5) {
        const fwdHN     = fwdH.scale(1 / fwdHLen);
        // Target horizontal velocity: same horizontal speed, but in nose direction
        const targetVx  = fwdHN.x * velHorizSpd;
        const targetVz  = fwdHN.z * velHorizSpd;
        // Alignment rate: stronger at higher speed, capped to avoid snapping
        const alignRate = Math.min(1.0, (2.0 + speed * 0.016) * dt);
        this.velocity.x += (targetVx - this.velocity.x) * alignRate;
        this.velocity.z += (targetVz - this.velocity.z) * alignRate;
      }

      // Clamp to max airspeed
      const newSpeed = this.velocity.length();
      if (newSpeed > this.MAX_SPEED) this.velocity.scaleInPlace(this.MAX_SPEED / newSpeed);

      this.planeMesh.position.addInPlace(this.velocity.scale(dt));
    }

    // Update public speed scalar (HUD, landing checks, bomb/gun inherit velocity)
    this.speed = this.velocity.length();

    // Spin propellers: 30 rad/s at idle, 300 rad/s at full throttle
    for (const p of this.propMeshes) {
      p.rotate(Axis.Z, (30 + this.throttle * 270) * dt, Space.LOCAL);
    }

    // Apply cockpit look-around rotation (accumulated from mouse drag).
    // A fixed 0.10 rad (~6°) base pitch keeps the instrument panel in frame
    // by default; mouse drag adjusts around that baseline.
    this.cockpitCamera.rotation.y = this.cockpitLookH;
    this.cockpitCamera.rotation.x = 0.10 + this.cockpitLookV;

    // Keep orbit camera centred on the plane
    this.orbitCamera.target.copyFrom(this.planeMesh.position);

    // Altimeter — height above ground (y=0)
    this.altitude = Math.max(0, this.planeMesh.position.y);

    // ── Stall ────────────────────────────────────────────────────────────────
    // Stall when AoA exceeds the critical angle OR airspeed falls below stall speed.
    this.stalling = !this.landed && this.altitude > 5 &&
      (AoA > this.CL_STALL_ONSET || this.speed < this.STALL_SPEED);
    if (this.stalling) {
      // Nose-drop proportional to stall severity; gravity then naturally rebuilds
      // airspeed once the nose drops, enabling realistic stall recovery.
      const aoa_excess    = Math.max(0, AoA - this.CL_STALL_ONSET);
      const speed_deficit = Math.max(0, this.STALL_SPEED - this.speed) / this.STALL_SPEED;
      const stallRate     = Math.max(aoa_excess * 2.0, speed_deficit * 0.45);
      this.planeMesh.rotate(Axis.X, stallRate * dt, Space.LOCAL);
    }

    // ── Weather effects ───────────────────────────────────────────────────────
    if (this.weather && !this.landed && this.altitude > 2) {
      // Wind drift in world space
      this.planeMesh.position.x += this.weather.wind.x * dt;
      this.planeMesh.position.z += this.weather.wind.z * dt;
      // Turbulence: small random rotations and vertical jitter
      if (this.weather.turbulence > 0.05) {
        const t = this.weather.turbulence;
        this.planeMesh.rotate(Axis.X, (Math.random() - 0.5) * t * 0.004, Space.LOCAL);
        this.planeMesh.rotate(Axis.Z, (Math.random() - 0.5) * t * 0.004, Space.LOCAL);
        this.velocity.y += (Math.random() - 0.5) * t * 4 * dt;
      }
    }

    // ── Landing detection (must run before crash check) ──────────────────────
    if (!this.landed) {
      for (const airport of this.airports) {
        for (const rw of airport.runways) {
          if (this.checkRunwayLanding(rw)) {
            this.performLanding(airport);
            return;
          }
        }
      }
    }

    // ── Crash detection (skipped while taxiing on the ground) ────────────────
    if (!this.landed) {
      const terrainH = this.getTerrainHeightAt(this.planeMesh.position.x, this.planeMesh.position.z);
      if (this.planeMesh.position.y < terrainH + 0.5) {
        this.handleCrash('You hit the ground!');
        return;
      }
      // Building checks are skipped for a few seconds after takeoff
      // so runway-adjacent structures don't cause an instant crash.
      if (this.liftoffGraceTimer <= 0) {
        for (const mesh of this.structureMeshes.values()) {
          if (this.planeMesh.intersectsMesh(mesh, false)) {
            this.handleCrash('You flew into a building!');
            return;
          }
        }
      }
    }

    // Decrement grace timer
    if (this.liftoffGraceTimer > 0) this.liftoffGraceTimer -= dt;

    // ── Landing message timer ─────────────────────────────────────────────────
    if (this.landingMsgTimer > 0) {
      this.landingMsgTimer -= dt;
      if (this.landingMsgTimer <= 0) {
        this.ngZone.run(() => { this.landingMsg = ''; });
      }
    }

    // Refresh structures when the player has flown far enough from the last fetch
    const flatPos = new Vector3(this.planeMesh.position.x, 0, this.planeMesh.position.z);
    if (!this.lastFetchPos || Vector3.Distance(flatPos, this.lastFetchPos) > this.REFETCH_DIST) {
      this.fetchStructures();
    }
    if (!this.lastTerrainFetchPos || Vector3.Distance(flatPos, this.lastTerrainFetchPos) > this.TERRAIN_REFETCH_DIST) {
      this.fetchTerrain();
    }
    if (!this.lastRoadFetchPos || Vector3.Distance(flatPos, this.lastRoadFetchPos) > this.ROAD_REFETCH_DIST) {
      this.fetchRoads();
    }

    // ── Multiplayer: broadcast local position at fixed interval ────────────
    this.wsBroadcastTimer += dt;
    if (this.wsBroadcastTimer >= this.WS_BROADCAST_INTERVAL) {
      this.wsBroadcastTimer = 0;
      this.broadcastPosition();
    }

    // ── Multiplayer: hide other players beyond loaded terrain radius ────────
    for (const [, op] of this.otherPlayers) {
      const dist = Vector3.Distance(this.planeMesh.position, op.root.position);
      op.root.setEnabled(dist < this.TERRAIN_FETCH_RADIUS);
    }

    // ── Minimap ──────────────────────────────────────────────────────────────
    this.minimapTimer += dt;
    if (this.minimapTimer >= this.MINIMAP_UPDATE_INTERVAL) {
      this.minimapTimer = 0;
      this.updateMinimap();
    }
  }

  // ── Structure loading ─────────────────────────────────────────────────────

  private fetchStructures(): void {
    if (this.isFetchingStructures) return;
    this.isFetchingStructures = true;

    const px = this.planeMesh.position.x;
    const pz = this.planeMesh.position.z;
    this.lastFetchPos = new Vector3(px, 0, pz);

    const r   = this.FETCH_RADIUS;
    const url = `${Settings.apiUrl}structures?minX=${px - r}&maxX=${px + r}&minZ=${pz - r}&maxZ=${pz + r}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GameStructure[]>;
      })
      .then(structures => this.ngZone.run(() => this.updateStructureMeshes(structures)))
      .catch(() => { /* server may not be running in dev — silent fail */ })
      .finally(() => { this.isFetchingStructures = false; });
  }

  private updateStructureMeshes(structures: GameStructure[]): void {
    const incomingIds = new Set(structures.map(s => s.id));

    // Remove meshes that left the visible area
    for (const [id, mesh] of this.structureMeshes) {
      if (!incomingIds.has(id)) {
        mesh.dispose();
        this.structureMeshes.delete(id);
      }
    }

    // Add meshes for newly-visible structures
    for (const s of structures) {
      if (!this.structureMeshes.has(s.id)) {
        const mesh = MeshBuilder.CreateBox(`structure-${s.id}`, {
          width:  s.width,
          height: s.height,
          depth:  s.depth,
        }, this.scene);
        // Position so the base sits on the ground (Y = 0)
        mesh.position = new Vector3(s.x, s.height / 2, s.z);
        mesh.material = s.type === 'tower'  ? this.towerMat
                      : s.type === 'hangar' ? this.hangarMat
                      :                       this.buildingMat;
        this.structureMeshes.set(s.id, mesh);
      }
    }
  }

  // ── Hydrography loading ───────────────────────────────────────────────────

  private fetchHydrography(): void {
    if (this.isFetchingHydro) return;
    this.isFetchingHydro = true;

    // Use a large radius — water features are static, one fetch covers the area
    const px = this.planeMesh.position.x;
    const pz = this.planeMesh.position.z;
    const r  = 3000;
    const url = `${Settings.apiUrl}hydrography?minX=${px - r}&maxX=${px + r}&minZ=${pz - r}&maxZ=${pz + r}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GameHydrography[]>;
      })
      .then(features => this.ngZone.run(() => this.updateHydroMeshes(features)))
      .catch(() => { /* silent fail when server is offline */ })
      .finally(() => { this.isFetchingHydro = false; });
  }

  private updateHydroMeshes(features: GameHydrography[]): void {
    for (const h of features) {
      if (this.hydroMeshes.has(h.id)) continue;

      // CreateGround: width = X axis, height param = Z axis
      const mesh = MeshBuilder.CreateGround(`hydro-${h.id}`, {
        width:       h.width,
        height:      h.depth,
        subdivisions: 1,
      }, this.scene);
      // Sit just above the terrain to avoid z-fighting
      mesh.position    = new Vector3(h.x, 0.05, h.z);
      mesh.material    = this.waterMat;
      mesh.isPickable  = false;
      this.hydroMeshes.set(h.id, mesh);
    }
  }

  // ── Terrain loading ──────────────────────────────────────────────────────

  private fetchTerrain(): void {
    if (this.isFetchingTerrain) return;
    this.isFetchingTerrain = true;

    const px = this.planeMesh.position.x;
    const pz = this.planeMesh.position.z;
    this.lastTerrainFetchPos = new Vector3(px, 0, pz);

    const r   = this.TERRAIN_FETCH_RADIUS;
    const url = `${Settings.apiUrl}terrain?minX=${px - r}&maxX=${px + r}&minZ=${pz - r}&maxZ=${pz + r}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<TerrainTile[]>;
      })
      .then(tiles => this.ngZone.run(() => this.updateTerrainMeshes(tiles)))
      .catch(() => { /* silent fail when server is offline */ })
      .finally(() => { this.isFetchingTerrain = false; });
  }

  private updateTerrainMeshes(tiles: TerrainTile[]): void {
    const incomingIds = new Set(tiles.map(t => t.id));

    // Dispose tiles that moved out of range
    for (const [id, mesh] of this.terrainMeshes) {
      if (!incomingIds.has(id)) {
        mesh.dispose();
        this.terrainMeshes.delete(id);
        this.terrainTileData.delete(id);
        const trees = this.treeMeshes.get(id);
        if (trees) { trees.forEach(t => t.dispose()); this.treeMeshes.delete(id); }
      }
    }

    // Build meshes for newly-visible tiles
    for (const tile of tiles) {
      if (this.terrainMeshes.has(tile.id)) continue;

      const N    = tile.resolution;
      const S    = tile.size;
      const step = S / (N - 1);

      const positions: number[] = [];
      const normals:   number[] = [];
      const uvs:       number[] = [];
      const indices:   number[] = [];

      // Build vertex grid (row-major: row = Z, col = X — matches server ordering)
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          positions.push(-S / 2 + col * step, tile.heights[row * N + col], -S / 2 + row * step);
          uvs.push(col / (N - 1), row / (N - 1));
        }
      }
      for (let row = 0; row < N - 1; row++) {
        for (let col = 0; col < N - 1; col++) {
          const a = row * N + col, b = a + 1, c = a + N, d = c + 1;
          indices.push(a, b, c, b, d, c);
        }
      }
      VertexData.ComputeNormals(positions, indices, normals);

      const vd      = new VertexData();
      vd.positions  = positions;
      vd.indices    = indices;
      vd.normals    = normals;
      vd.uvs        = uvs;

      const mesh       = new Mesh(`terrain-${tile.id}`, this.scene);
      vd.applyToMesh(mesh, false);
      mesh.position    = new Vector3(tile.worldX + S / 2, 0, tile.worldZ + S / 2);
      mesh.isPickable  = false;
      mesh.material    = tile.groundCover === 'forest'   ? this.forestMat
                       : tile.groundCover === 'farmland' ? this.farmMat
                       : tile.groundCover === 'arid'     ? this.aridMat
                       :                                   this.grasslandMat;
      this.terrainMeshes.set(tile.id, mesh);
      this.terrainTileData.set(tile.id, tile);

      // Procedural trees for forest tiles
      if (tile.groundCover === 'forest' && tile.trees.length > 0) {
        const tileTrees: Mesh[] = [];
        for (const tree of tile.trees) {
          const h     = this.sampleTileHeight(tile, tree.x, tree.z);
          const coneH = 8 * tree.scale;
          const cone  = MeshBuilder.CreateCylinder(`tree-${tile.id}-${tileTrees.length}`, {
            height:         coneH,
            diameterTop:    0,
            diameterBottom: 4.5 * tree.scale,
            tessellation:   6,
          }, this.scene);
          cone.position   = new Vector3(tree.x, h + coneH / 2, tree.z);
          cone.material   = this.treeMat;
          cone.isPickable = false;
          tileTrees.push(cone);
        }
        this.treeMeshes.set(tile.id, tileTrees);
      }
    }
  }

  /** Nearest-neighbour height lookup for a world position within a tile. */
  private sampleTileHeight(tile: TerrainTile, wx: number, wz: number): number {
    const step  = tile.size / (tile.resolution - 1);
    const col   = Math.max(0, Math.min(tile.resolution - 1, Math.round((wx - tile.worldX) / step)));
    const row   = Math.max(0, Math.min(tile.resolution - 1, Math.round((wz - tile.worldZ) / step)));
    return tile.heights[row * tile.resolution + col];
  }

  /** Returns the terrain height at an arbitrary world (x, z) position by looking up the loaded tile. */
  private getTerrainHeightAt(wx: number, wz: number): number {
    const tileX  = Math.floor(wx / 4000);
    const tileZ  = Math.floor(wz / 4000);
    const tile   = this.terrainTileData.get(`${tileX}_${tileZ}`);
    return tile ? this.sampleTileHeight(tile, wx, wz) : 0;
  }

  // ── Roads loading ────────────────────────────────────────────────────────

  private fetchRoads(): void {
    if (this.isFetchingRoads) return;
    this.isFetchingRoads = true;

    const px = this.planeMesh.position.x;
    const pz = this.planeMesh.position.z;
    this.lastRoadFetchPos = new Vector3(px, 0, pz);

    const r   = this.ROAD_FETCH_RADIUS;
    const url = `${Settings.apiUrl}roads?minX=${px - r}&maxX=${px + r}&minZ=${pz - r}&maxZ=${pz + r}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GameRoad[]>;
      })
      .then(roads => this.ngZone.run(() => this.updateRoadMeshes(roads)))
      .catch(() => { /* silent fail when server is offline */ })
      .finally(() => { this.isFetchingRoads = false; });
  }

  private updateRoadMeshes(roads: GameRoad[]): void {
    const incomingIds = new Set(roads.map(r => r.id));

    // Remove road meshes that went out of range
    for (const [id, mesh] of this.roadMeshes) {
      if (!incomingIds.has(id)) { mesh.dispose(); this.roadMeshes.delete(id); }
    }

    for (const road of roads) {
      if (this.roadMeshes.has(road.id)) continue;

      const isNS   = road.x1 === road.x2;  // North-South segment (constant X)
      const length = isNS ? Math.abs(road.z2 - road.z1) : Math.abs(road.x2 - road.x1);

      if (length <= 0) continue;

      const mesh = MeshBuilder.CreateBox(`road-${road.id}`, {
        width:  isNS ? road.width : length,
        height: 0.15,
        depth:  isNS ? length     : road.width,
      }, this.scene);

      mesh.position   = new Vector3(
        isNS ? road.x1 : (road.x1 + road.x2) / 2,
        0.15,
        isNS ? (road.z1 + road.z2) / 2 : road.z1,
      );
      mesh.material   = road.type === 'highway' ? this.highwayMat : this.localRoadMat;
      mesh.isPickable = false;
      this.roadMeshes.set(road.id, mesh);
    }
  }

  get liftoffSpeed(): number { return Math.round(Math.sqrt(this.GRAVITY / this.LIFT_K)); }

  private fetchAirports(): void {
    if (this.isFetchingAirports) return;
    this.isFetchingAirports = true;
    fetch(`${Settings.apiUrl}airports`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<GameAirport[]>; })
      .then(airports => this.ngZone.run(() => { this.airports = airports; this.updateAirportMeshes(airports); }))
      .catch(() => {})
      .finally(() => { this.isFetchingAirports = false; });
  }

  private updateAirportMeshes(airports: GameAirport[]): void {
    for (const meshes of this.airportMeshes.values()) meshes.forEach(m => m.dispose());
    this.airportMeshes.clear();
    for (const airport of airports) {
      const meshes: Mesh[] = [];
      // Beacon sphere visible from the air
      const beacon = MeshBuilder.CreateSphere(`beacon-${airport.id}`, { diameter: 8, segments: 8 }, this.scene);
      beacon.position = new Vector3(airport.x, airport.elevation + 20, airport.z);
      beacon.material = this.airportBeaconMat;
      beacon.isPickable = false;
      meshes.push(beacon);
      for (const rw of airport.runways) {
        const rad = rw.heading * Math.PI / 180;
        const halfL = rw.length / 2;
        const fwdX  = Math.sin(rad);
        const fwdZ  = Math.cos(rad);
        // Runway surface
        const surface = MeshBuilder.CreateGround(`rwy-${rw.id}`, {
          width: rw.width, height: rw.length, subdivisions: 1,
        }, this.scene);
        surface.position = new Vector3(rw.x, rw.elevation + 0.2, rw.z);
        surface.rotation.y = -rad;
        const rwMat = new StandardMaterial(`rwMat-${rw.id}`, this.scene);
        rwMat.diffuseTexture = this.createRunwayTexture(this.scene);
        rwMat.specularColor = Color3.Black();
        surface.material = rwMat;
        surface.isPickable = false;
        meshes.push(surface);
        // Yellow threshold bars at each runway end
        for (const sign of [-1, 1] as const) {
          const wx = rw.x + sign * halfL * fwdX;
          const wz = rw.z + sign * halfL * fwdZ;
          const bar = MeshBuilder.CreateBox(`thrsh-${rw.id}-${sign}`, {
            width: rw.width * 1.15, height: 0.4, depth: 5,
          }, this.scene);
          bar.position = new Vector3(wx, rw.elevation + 0.35, wz);
          bar.rotation.y = -rad;
          bar.material = this.runwayThresholdMat;
          bar.isPickable = false;
          meshes.push(bar);
        }
      }
      this.airportMeshes.set(airport.id, meshes);
    }
  }

  private isOnRunway(rw: GameRunway): boolean {
    const dx  = this.planeMesh.position.x - rw.x;
    const dz  = this.planeMesh.position.z - rw.z;
    const rad = rw.heading * Math.PI / 180;
    const localFwd   = dx * Math.sin(rad) + dz * Math.cos(rad);
    const localRight = dx * Math.cos(rad) - dz * Math.sin(rad);
    return Math.abs(localFwd) < rw.length / 2 + 20 && Math.abs(localRight) < rw.width / 2 + 4;
  }

  private checkRunwayLanding(rw: GameRunway): boolean {
    const py = this.planeMesh.position.y;
    if (py > rw.elevation + 8 || py < rw.elevation - 1) return false;
    if (!this.isOnRunway(rw)) return false;
    if (this.speed > 240) return false;
    if (this.velocity.y < -20) return false;
    if (this.velocity.y > 3) return false;
    const localUp = this.planeMesh.getDirection(Axis.Y);
    return localUp.y > 0.85;
  }

  private performLanding(airport: GameAirport): void {
    this.landed    = true;
    this.velocity.y = 0;
    this.planeMesh.position.y = airport.elevation + this.GROUND_OFFSET;
    // Auto-extend gear on touchdown so it is always down after landing
    if (this.retractableGear && !this.gearDown) {
      this.gearDown       = true;
      this.gearAnimTarget = 0;
    }
    this.ngZone.run(() => {
      this.landedAt      = airport.name;
      this.landingMsg    = `LANDED — ${airport.code}`;
      this.landingMsgTimer = 5.0;
    });
  }

  private createRunwayTexture(scene: Scene): DynamicTexture {
    const W = 128, H = 512;
    const tex = new DynamicTexture('runwayTex', { width: W, height: H }, scene, false);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    // Asphalt base
    ctx.fillStyle = '#2A2A2A'; ctx.fillRect(0, 0, W, H);
    // Yellow edge lines
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(3, 0, 3, H); ctx.fillRect(W - 6, 0, 3, H);
    // White threshold bars at each end
    ctx.fillStyle = '#FFFFFF';
    const bw = 10, bh = 50, bg = 4;
    const totalBW = 6 * bw + 5 * bg;
    const bStartX = (W - totalBW) / 2;
    for (let i = 0; i < 6; i++) {
      const bx = bStartX + i * (bw + bg);
      ctx.fillRect(bx, 10, bw, bh);
      ctx.fillRect(bx, H - 10 - bh, bw, bh);
    }
    // Centerline dashes
    const dashOn = 28, dashOff = 22;
    const cx = (W - 6) / 2;
    for (let y = 90; y < H - 90; y += dashOn + dashOff) {
      ctx.fillRect(cx, y, 6, dashOn);
    }
    // Aiming point markers at 25% and 75%
    const am = 22, ah = 50, gap = 10;
    const amX = (W - (2 * am + gap)) / 2;
    for (const yp of [H * 0.25 - ah / 2, H * 0.75 - ah / 2]) {
      ctx.fillRect(amX, yp, am, ah);
      ctx.fillRect(amX + am + gap, yp, am, ah);
    }
    tex.update();
    return tex;
  }

  // ── Bomb bay ──────────────────────────────────────────────────────────────

  /** Creates two door panels hinged at the fuselage centreline (x = 0, y ≈ −1.1). */
  private buildBombBayDoors(): void {
    this.disposeBombBayDoors();
    // Bomb bay opening spans z ≈ −0.5 → 4.5 under the forward fuselage
    // Door panels: width 1.08 (half of fuselage width ~2.16), depth 5.0, height 0.10
    // Pivot at the inner edge (x = 0, y = −1.12) — outer edge hinges outward/down when open
    for (const side of [-1, 1]) {        // -1 = left, +1 = right
      const pivot = new TransformNode(`bombDoorPivot${side}`, this.scene);
      pivot.parent   = this.planeMesh;
      pivot.position = new Vector3(0, -1.12, 2.0); // hinge at fuselage bottom-centre

      const door = MeshBuilder.CreateBox(`bombDoor${side}`, {
        width: 1.08, height: 0.10, depth: 5.0,
      }, this.scene);
      door.parent   = pivot;
      door.position = new Vector3(side * 0.54, 0, 0); // offset so inner edge is at x=0
      door.material  = this.bombDoorMat;
      door.isPickable = false;

      this.bombDoorPivots.push(pivot);
      this.bombDoorMeshes.push(door);
    }
  }

  private disposeBombBayDoors(): void {
    for (const m of this.bombDoorMeshes) m.dispose();
    this.bombDoorMeshes = [];
    for (const p of this.bombDoorPivots) p.dispose();
    this.bombDoorPivots = [];
  }

  /** Smoothly animates landing gear retraction and extension. */
  private updateGear(dt: number): void {
    if (Math.abs(this.gearAnimProgress - this.gearAnimTarget) < 0.001) return;
    const dir = this.gearAnimTarget > this.gearAnimProgress ? 1 : -1;
    // Unhide meshes the instant we start extending
    if (dir < 0 && this.gearAnimProgress >= 0.98) {
      for (const m of this.gearMeshes) m.isVisible = true;
    }
    this.gearAnimProgress = Math.max(0, Math.min(1,
      this.gearAnimProgress + dir * this.GEAR_ANIM_SPEED * dt));
    for (let i = 0; i < this.gearMeshes.length; i++) {
      this.gearMeshes[i].position.y =
        this.gearOriginalPositions[i].y + this.gearAnimProgress * this.GEAR_RETRACT_LIFT;
    }
    // Hide meshes once fully retracted
    if (this.gearAnimProgress >= 0.98) {
      for (const m of this.gearMeshes) m.isVisible = false;
    }
  }

  /**
   * Smoothly animates the bomb bay doors toward the target angle.
   * Left door: pivot.rotation.z = +angle (outer edge drops down).
   * Right door: pivot.rotation.z = −angle (mirrors left).
   */
  private animateBombBayDoors(dt: number): void {
    const target = this.bombBayOpen ? Math.PI / 2 : 0;
    const dir    = target > this.bombBayAngle ? 1 : -1;
    this.bombBayAngle = Math.max(0, Math.min(Math.PI / 2,
      this.bombBayAngle + dir * this.BOMB_DOOR_SPEED * dt));

    if (this.bombDoorPivots.length >= 2) {
      this.bombDoorPivots[0].rotation.z =  this.bombBayAngle; // left door
      this.bombDoorPivots[1].rotation.z = -this.bombBayAngle; // right door (mirror)
    }
  }

  /** Releases one bomb from the current bomb bay position. */
  private dropBomb(): void {
    if (!this.bombBayOpen || this.landed || this.bombPositions.length === 0) return;

    const idx      = this.nextBombPos % this.bombPositions.length;
    this.nextBombPos++;
    const lp = this.bombPositions[idx];

    // World-space release point
    const wm      = this.planeMesh.getWorldMatrix();
    const worldPos = Vector3.TransformCoordinates(new Vector3(lp.x, lp.y, lp.z), wm);

    // Bomb inherits the aircraft's full world-space velocity
    const velocity = this.velocity.clone();
    velocity.y    -= 1.5; // small ejection nudge downward

    // ── Build bomb mesh (cylinders parented to a TransformNode) ───────────
    const id   = `bomb-${Date.now()}`;
    const root = new TransformNode(`${id}-root`, this.scene);
    root.position = worldPos.clone();

    // Body: cylinder lying along root's +Z (rotated 90° on X from BabylonJS Y-up cylinder)
    const body = MeshBuilder.CreateCylinder(`${id}-body`,
      { height: 1.4, diameter: 0.38, tessellation: 10 }, this.scene);
    body.rotation.x = Math.PI / 2;
    body.parent     = root;
    body.material   = this.bombMat;
    body.isPickable = false;

    // Nose cone (at +Z end of body)
    const nose = MeshBuilder.CreateCylinder(`${id}-nose`,
      { height: 0.48, diameterTop: 0.04, diameterBottom: 0.38, tessellation: 10 }, this.scene);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 0.94;  // front tip of body
    nose.parent     = root;
    nose.material   = this.bombMat;
    nose.isPickable = false;

    // Stabiliser fins (flat cross at −Z tail)
    const fins = MeshBuilder.CreateBox(`${id}-fins`,
      { width: 0.68, height: 0.68, depth: 0.10 }, this.scene);
    fins.position.z = -0.73;
    fins.parent     = root;
    fins.material   = this.bombMat;
    fins.isPickable = false;

    // Orient the root to the release velocity
    this.alignNodeToVelocity(root, velocity);

    this.bombs.push({ root, meshes: [body, nose, fins], velocity: velocity.clone() });

    // Broadcast to other players
    if (this.multiWs?.readyState === WebSocket.OPEN) {
      this.multiWs.send(JSON.stringify({
        type: 'bomb',
        x: worldPos.x, y: worldPos.y, z: worldPos.z,
        vx: velocity.x, vy: velocity.y, vz: velocity.z,
      }));
    }
  }

  /** Spawns a bomb mesh from a remote player's broadcast and adds it to the simulation. */
  private spawnRemoteBomb(data: { x: number; y: number; z: number; vx: number; vy: number; vz: number }): void {
    const worldPos = new Vector3(+data.x || 0, +data.y || 0, +data.z || 0);
    const velocity = new Vector3(+data.vx || 0, +data.vy || 0, +data.vz || 0);

    const id   = `rbomb-${Date.now()}`;
    const root = new TransformNode(`${id}-root`, this.scene);
    root.position = worldPos.clone();

    const body = MeshBuilder.CreateCylinder(`${id}-body`,
      { height: 1.4, diameter: 0.38, tessellation: 10 }, this.scene);
    body.rotation.x = Math.PI / 2;
    body.parent     = root;
    body.material   = this.bombMat;
    body.isPickable = false;

    const nose = MeshBuilder.CreateCylinder(`${id}-nose`,
      { height: 0.48, diameterTop: 0.04, diameterBottom: 0.38, tessellation: 10 }, this.scene);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 0.94;
    nose.parent     = root;
    nose.material   = this.bombMat;
    nose.isPickable = false;

    const fins = MeshBuilder.CreateBox(`${id}-fins`,
      { width: 0.68, height: 0.68, depth: 0.10 }, this.scene);
    fins.position.z = -0.73;
    fins.parent     = root;
    fins.material   = this.bombMat;
    fins.isPickable = false;

    this.alignNodeToVelocity(root, velocity);
    this.bombs.push({ root, meshes: [body, nose, fins], velocity: velocity.clone() });
  }

  /** Advances all live bombs; detonates on terrain contact. */
  private updateBombs(dt: number): void {
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const b = this.bombs[i];

      // Gravity
      b.velocity.y -= this.BOMB_GRAVITY * dt;

      // Move
      b.root.position.addInPlace(b.velocity.scale(dt));

      // Keep nose pointing in the direction of travel
      this.alignNodeToVelocity(b.root, b.velocity);

      // Impact check
      const th = this.getTerrainHeightAt(b.root.position.x, b.root.position.z);
      if (b.root.position.y <= th + 0.5) {
        const impactPos = b.root.position.clone();
        impactPos.y = th;
        b.root.dispose();   // disposes root + all parented children
        this.bombs.splice(i, 1);
        this.createExplosion(impactPos);
      }
    }
  }

  /** Rotates a TransformNode so its local +Z aligns with the velocity vector. */
  private alignNodeToVelocity(node: TransformNode, vel: Vector3): void {
    const spd = vel.length();
    if (spd < 0.001) return;
    const fwd = vel.scale(1 / spd);
    let right = Vector3.Cross(Vector3.Up(), fwd);
    if (right.lengthSquared() < 0.001) right = Vector3.Cross(Vector3.Right(), fwd);
    right = right.normalize();
    const up = Vector3.Cross(fwd, right).normalizeToNew();
    node.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(right, up, fwd);
  }

  /** Creates a fire + rising smoke explosion at the given world-space impact position. */
  private createExplosion(pos: Vector3): void {
    // ── Shared procedural textures ─────────────────────────────────────────
    const fireTex  = new DynamicTexture(`expFireTex-${Date.now()}`,  { width: 64, height: 64 }, this.scene, false);
    const fCtx     = fireTex.getContext() as CanvasRenderingContext2D;
    const fGrad    = fCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    fGrad.addColorStop(0,   'rgba(255,235,60,1)');
    fGrad.addColorStop(0.5, 'rgba(255,90,10,0.8)');
    fGrad.addColorStop(1,   'rgba(0,0,0,0)');
    fCtx.fillStyle = fGrad;
    fCtx.beginPath(); fCtx.arc(32, 32, 32, 0, Math.PI * 2); fCtx.fill();
    fireTex.update();

    const smokeTex = new DynamicTexture(`expSmokeTex-${Date.now()}`, { width: 64, height: 64 }, this.scene, false);
    const sCtx     = smokeTex.getContext() as CanvasRenderingContext2D;
    const sGrad    = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sGrad.addColorStop(0,   'rgba(70,65,55,0.95)');
    sGrad.addColorStop(0.6, 'rgba(50,47,40,0.65)');
    sGrad.addColorStop(1,   'rgba(0,0,0,0)');
    sCtx.fillStyle = sGrad;
    sCtx.beginPath(); sCtx.arc(32, 32, 32, 0, Math.PI * 2); sCtx.fill();
    smokeTex.update();

    // ── Fireball ───────────────────────────────────────────────────────────
    const fire = new ParticleSystem(`bombFire-${Date.now()}`, 700, this.scene);
    fire.particleTexture = fireTex;
    fire.emitter         = pos.clone();
    fire.minEmitBox      = new Vector3(-2.5, 0,    -2.5);
    fire.maxEmitBox      = new Vector3( 2.5, 1.0,   2.5);
    fire.direction1      = new Vector3(-5,  14,  -5);
    fire.direction2      = new Vector3( 5,  26,   5);
    fire.minLifeTime     = 0.18;
    fire.maxLifeTime     = 0.75;
    fire.emitRate        = 380;
    fire.minSize         = 1.8;
    fire.maxSize         = 6.0;
    fire.minInitialRotation = 0;
    fire.maxInitialRotation = Math.PI * 2;
    fire.color1          = new Color4(1.0,  0.82, 0.12, 1.0);
    fire.color2          = new Color4(1.0,  0.22, 0.04, 0.88);
    fire.colorDead       = new Color4(0.04, 0.04, 0.04, 0.0);
    fire.blendMode       = ParticleSystem.BLENDMODE_ADD;
    fire.start();

    // ── Rising smoke column ────────────────────────────────────────────────
    const smoke = new ParticleSystem(`bombSmoke-${Date.now()}`, 350, this.scene);
    smoke.particleTexture = smokeTex;
    smoke.emitter         = pos.clone();
    smoke.minEmitBox      = new Vector3(-3,   1.5, -3);
    smoke.maxEmitBox      = new Vector3( 3,   4.0,  3);
    smoke.direction1      = new Vector3(-2,  10,  -2);
    smoke.direction2      = new Vector3( 2,  22,   2);
    smoke.minLifeTime     = 4.0;
    smoke.maxLifeTime     = 11.0;
    smoke.emitRate        = 55;
    smoke.minSize         = 4.5;
    smoke.maxSize         = 16.0;
    smoke.minInitialRotation = 0;
    smoke.maxInitialRotation = Math.PI * 2;
    smoke.color1          = new Color4(0.09, 0.09, 0.09, 0.82);
    smoke.color2          = new Color4(0.22, 0.19, 0.15, 0.62);
    smoke.colorDead       = new Color4(0.35, 0.30, 0.25, 0.0);
    smoke.start();

    this.explosions.push({ fire, smoke, age: 0, maxAge: this.EXPLOSION_FIRE_DURATION });
  }

  /** Ticks all active explosion timers; stops fire emitters and disposes aged-out effects. */
  private updateExplosions(dt: number): void {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const e = this.explosions[i];
      e.age += dt;
      // Cut fire emitter after maxAge but let existing particles burn out
      if (e.age >= e.maxAge && e.fire.isStarted()) e.fire.stop();
      // Smoke runs 4× longer than fire before disposal
      if (e.age >= e.maxAge * 4) {
        e.fire.dispose();
        e.smoke.stop();
        e.smoke.dispose();
        this.explosions.splice(i, 1);
      }
    }
  }

  // ── Minimap ───────────────────────────────────────────────────────────────

  private fetchTowns(): void {
    fetch(`${Settings.apiUrl}towns`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<GameTown[]>; })
      .then(towns => { this.towns = towns; })
      .catch(() => {});
  }

  private updateMinimap(): void {
    const canvas = this.minimapCanvasRef.nativeElement;
    const ctx    = canvas.getContext('2d');
    if (!ctx) return;

    const size  = canvas.width;    // 210
    const cx    = size / 2;
    const cy    = size / 2;
    const r     = size / 2 - 1;   // clip radius (1 px inset from edge)
    const scale = r / this.MINIMAP_RANGE;

    const px = this.planeMesh.position.x;
    const pz = this.planeMesh.position.z;

    // World → canvas helpers (North = +Z = canvas top)
    const toMapX = (wx: number) => cx + (wx - px) * scale;
    const toMapY = (wz: number) => cy - (wz - pz) * scale;  // canvas Y is inverted

    // ── Clear + clip to circle ──
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Background
    ctx.fillStyle = 'rgba(8, 16, 26, 0.84)';
    ctx.fillRect(0, 0, size, size);

    // Distance rings
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    for (const frac of [0.33, 0.66]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * frac, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Cardinal cross-hairs
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, 4); ctx.lineTo(cx, size - 4);
    ctx.moveTo(4, cy); ctx.lineTo(size - 4, cy);
    ctx.stroke();

    // ── Towns ──
    for (const town of this.towns) {
      const mx = toMapX(town.x);
      const my = toMapY(town.z);
      if (mx < -20 || mx > size + 20 || my < -20 || my > size + 20) continue;

      ctx.fillStyle = 'rgba(190, 210, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(170, 195, 240, 0.85)';
      ctx.textAlign = 'left';
      ctx.fillText(town.name, mx + 6, my + 3);
    }

    // ── Airports — runways + code label ──
    for (const airport of this.airports) {
      for (const rw of airport.runways) {
        const rwMX  = toMapX(rw.x);
        const rwMY  = toMapY(rw.z);
        const rwLen = Math.max(4, rw.length * scale);
        const rwWid = Math.max(2, rw.width  * scale);
        ctx.save();
        ctx.translate(rwMX, rwMY);
        // heading 0 = N–S = vertical on canvas; heading 90 = E–W = horizontal
        ctx.rotate(rw.heading * Math.PI / 180);
        ctx.fillStyle = 'rgba(255, 210, 80, 0.85)';
        ctx.fillRect(-rwWid / 2, -rwLen / 2, rwWid, rwLen);
        ctx.restore();
      }
      const mx = toMapX(airport.x);
      const my = toMapY(airport.z);
      if (mx >= -20 && mx <= size + 20 && my >= -20 && my <= size + 20) {
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = 'rgba(255, 220, 70, 1)';
        ctx.textAlign = 'center';
        ctx.fillText(airport.code, mx, my - 8);
      }
    }

    // ── Other players ──
    for (const [, op] of this.otherPlayers) {
      const mx = toMapX(op.root.position.x);
      const my = toMapY(op.root.position.z);
      if (mx < 0 || mx > size || my < 0 || my > size) continue;

      ctx.save();
      ctx.translate(mx, my);
      ctx.fillStyle = 'rgba(255, 120, 0, 1)';
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(4, 5); ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();

      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(255, 150, 50, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(op.callsign, 0, -7);
      ctx.restore();
    }

    // ── Player arrow ──
    const fwd     = this.planeMesh.getDirection(Axis.Z);
    const heading = Math.atan2(fwd.x, fwd.z);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(heading);
    ctx.fillStyle   = '#ffffff';
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -9);    // nose
    ctx.lineTo(5.5,  6);  // right wing tip
    ctx.lineTo(0,    3);  // tail notch
    ctx.lineTo(-5.5, 6);  // left wing tip
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // end clip

    // ── Compass 'N' ──
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, 14);
  }

  /**
   * Fires one salvo: one tracer from each gun position simultaneously.
   * Broadcasts the salvo to other players via WebSocket.
   */
  private fireGuns(): void {
    if (this.gunPositions.length === 0) return;
    const wm      = this.planeMesh.getWorldMatrix();
    const forward = this.planeMesh.getDirection(Axis.Z);
    const velocity = this.velocity.add(forward.scale(this.TRACER_SPEED));

    // Collect world-space gun origins so we can broadcast them
    const gunData: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = [];

    for (const gp of this.gunPositions) {
      const worldPos = Vector3.TransformCoordinates(new Vector3(gp.x, gp.y, gp.z), wm);
      this.spawnTracerAt(worldPos, velocity.clone());
      gunData.push({ x: worldPos.x, y: worldPos.y, z: worldPos.z,
                     vx: velocity.x, vy: velocity.y, vz: velocity.z });
    }

    // Broadcast salvo so other players see the tracers
    if (this.multiWs?.readyState === WebSocket.OPEN) {
      this.multiWs.send(JSON.stringify({ type: 'fire', guns: gunData }));
    }
  }

  /** Creates a single tracer mesh at a world position with the given velocity. */
  private spawnTracerAt(pos: Vector3, vel: Vector3): void {
    const mesh = MeshBuilder.CreateBox(`tracer-${Date.now()}-${Math.random()}`,
      { width: 0.06, height: 0.06, depth: 2.4 }, this.scene);
    mesh.position = pos;
    this.alignMeshToVelocity(mesh, vel);
    mesh.material  = this.tracerMat;
    mesh.isPickable = false;
    this.tracerRounds.push({ mesh, velocity: vel, distanceTravelled: 0 });
  }

  /** Advances all active tracer rounds with gravity-induced drop; disposes any that exceed max range. */
  private updateTracers(dt: number): void {
    for (let i = this.tracerRounds.length - 1; i >= 0; i--) {
      const t = this.tracerRounds[i];
      // Bullet drop — gravity pulls the Y velocity down over time
      t.velocity.y -= this.TRACER_BULLET_GRAVITY * dt;
      const move = t.velocity.scale(dt);
      t.mesh.position.addInPlace(move);
      t.distanceTravelled += move.length();
      // Keep mesh oriented along its current travel direction so the elongated
      // box tracks the arc visually instead of staying frozen on the fire angle
      this.alignMeshToVelocity(t.mesh, t.velocity);
      if (t.distanceTravelled >= this.TRACER_MAX_RANGE) {
        t.mesh.dispose();
        this.tracerRounds.splice(i, 1);
      }
    }
  }

  /** Rotates a mesh so its local +Z axis aligns with the given velocity vector. */
  private alignMeshToVelocity(mesh: Mesh, vel: Vector3): void {
    const speed = vel.length();
    if (speed < 0.001) return;
    const fwd   = vel.scale(1 / speed);
    let   right = Vector3.Cross(Vector3.Up(), fwd);
    if (right.lengthSquared() < 0.001) {
      // Velocity is (nearly) straight up or down — use +X as the up reference
      right = Vector3.Cross(Vector3.Right(), fwd);
    }
    right = right.normalize();
    const up = Vector3.Cross(fwd, right).normalizeToNew();
    mesh.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(right, up, fwd);
  }

  /** Spawns tracer meshes fired by a remote player (received via WebSocket). */
  private spawnRemoteTracers(guns: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[]): void {
    for (const g of guns) {
      const pos = new Vector3(+g.x || 0, +g.y || 0, +g.z || 0);
      const vel = new Vector3(+g.vx || 0, +g.vy || 0, +g.vz || 0);
      if (vel.length() < 1) continue; // ignore malformed packets
      this.spawnTracerAt(pos, vel);
    }
  }

  // ── Multiplayer helpers ───────────────────────────────────────────────────

  /** Generates a random callsign and persists it for the browser session. */
  private generateCallsign(): string {
    const stored = sessionStorage.getItem('mp_callsign');
    if (stored) return stored;
    const words = ['Eagle', 'Viper', 'Ghost', 'Ace', 'Fox', 'Wolf', 'Hawk', 'Storm', 'Razor', 'Blaze'];
    const cs = words[Math.floor(Math.random() * words.length)] +
               Math.floor(Math.random() * 900 + 100).toString();
    sessionStorage.setItem('mp_callsign', cs);
    return cs;
  }

  private initMultiplayer(): void {
    const ws = new WebSocket(Settings.wsUrl);
    this.multiWs = ws;

    ws.onmessage = (ev) => {
      let msg: any;
      try { msg = JSON.parse(ev.data as string); } catch { return; }
      switch (msg.type) {
        case 'welcome':
          this.myWsId = msg.id;
          break;
        case 'snapshot':
          for (const p of msg.players) this.upsertOtherPlayer(p.id, p);
          break;
        case 'update':
          if (msg.id !== this.myWsId) this.upsertOtherPlayer(msg.id, msg);
          break;
        case 'leave':
          this.removeOtherPlayer(msg.id);
          break;
        case 'fire':
          if (Array.isArray(msg.guns)) this.spawnRemoteTracers(msg.guns);
          break;
        case 'bomb':
          this.spawnRemoteBomb(msg);
          break;
      }
    };

    ws.onclose = () => { this.multiWs = null; };
    ws.onerror = () => { this.multiWs = null; };
  }

  private broadcastPosition(): void {
    if (!this.multiWs || this.multiWs.readyState !== WebSocket.OPEN) return;
    const q = this.planeMesh.rotationQuaternion ??
      Quaternion.FromEulerAngles(
        this.planeMesh.rotation.x,
        this.planeMesh.rotation.y,
        this.planeMesh.rotation.z,
      );
    this.multiWs.send(JSON.stringify({
      type:      'update',
      x:         this.planeMesh.position.x,
      y:         this.planeMesh.position.y,
      z:         this.planeMesh.position.z,
      qx:        q.x, qy: q.y, qz: q.z, qw: q.w,
      planeName: this.planeName,
      planeSlug: this.selectedPlaneSlug,
      callsign:  this.myCallsign,
    }));
  }

  private upsertOtherPlayer(id: string, data: {
    x: number; y: number; z: number;
    qx: number; qy: number; qz: number; qw: number;
    planeName: string; planeSlug: string; callsign: string;
  }): void {
    let op = this.otherPlayers.get(id);

    if (!op) {
      const root  = new TransformNode(`mp-root-${id}`, this.scene);
      const label = this.buildOtherPlayerLabel(data.callsign, data.planeName, root);
      op = { root, meshes: [], label, callsign: data.callsign, planeName: data.planeName, planeSlug: data.planeSlug };
      this.otherPlayers.set(id, op);
      // Fetch and build the real plane model asynchronously
      this.fetchAndBuildOtherPlayerModel(id, data.planeSlug ?? 'cessna-172', root, op);
    }

    op.root.position.set(data.x, data.y, data.z);

    if (op.root.rotationQuaternion) {
      op.root.rotationQuaternion.set(data.qx, data.qy, data.qz, data.qw);
    } else {
      op.root.rotationQuaternion = new Quaternion(data.qx, data.qy, data.qz, data.qw);
    }
  }

  /**
   * Fetches the plane model for an other player and builds their exterior meshes
   * parented to their root TransformNode. Falls back to a generic silhouette
   * if the API call fails.
   */
  private fetchAndBuildOtherPlayerModel(
    id: string, slug: string, root: TransformNode, op: OtherPlayer,
  ): void {
    fetch(`${Settings.apiUrl}planes/${slug}`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<GamePlane>; })
      .then(plane => {
        // Guard: player may have disconnected before the fetch completed
        if (!this.otherPlayers.has(id)) return;
        for (const m of op.meshes) m.dispose();
        op.meshes = [];
        for (const part of plane.parts) {
          let mesh: Mesh;
          if (part.shape === 'cylinder') {
            mesh = MeshBuilder.CreateCylinder(`mp-${id}-${part.id}`, {
              height:         part.params['height']        ?? 1,
              diameter:       part.params['diameter'],
              diameterTop:    part.params['diameterTop'],
              diameterBottom: part.params['diameterBottom'],
              tessellation:   part.params['tessellation']  ?? 12,
            }, this.scene);
          } else {
            mesh = MeshBuilder.CreateBox(`mp-${id}-${part.id}`, {
              width:  part.params['width']  ?? 1,
              height: part.params['height'] ?? 1,
              depth:  part.params['depth']  ?? 1,
            }, this.scene);
          }
          mesh.position = new Vector3(part.position.x, part.position.y, part.position.z);
          if (part.rotation) {
            mesh.rotation = new Vector3(part.rotation.x, part.rotation.y, part.rotation.z);
          }
          mesh.parent     = root;
          mesh.isPickable = false;
          // Default layerMask (0x0FFFFFFF) — visible in both orbit and cockpit cameras
          mesh.material   = this.buildPlanePartMaterial(part.material);
          op.meshes.push(mesh);
        }
      })
      .catch(() => {
        // Only build fallback if player is still around and has no meshes yet
        if (!this.otherPlayers.has(id) || op.meshes.length > 0) return;
        const body = MeshBuilder.CreateBox(`mp-fallback-body-${id}`,
          { width: 1.2, height: 0.6, depth: 5.5 }, this.scene);
        body.parent = root; body.material = this.otherPlayerMat; body.isPickable = false;
        const wings = MeshBuilder.CreateBox(`mp-fallback-wings-${id}`,
          { width: 9, height: 0.18, depth: 1.6 }, this.scene);
        wings.parent = root; wings.position.y = -0.05;
        wings.material = this.otherPlayerMat; wings.isPickable = false;
        const tail = MeshBuilder.CreateBox(`mp-fallback-tail-${id}`,
          { width: 3.5, height: 0.14, depth: 0.8 }, this.scene);
        tail.parent = root; tail.position.z = -2.4; tail.position.y = 0.2;
        tail.material = this.otherPlayerMat; tail.isPickable = false;
        op.meshes.push(body, wings, tail);
      });
  }

  private buildOtherPlayerLabel(callsign: string, planeName: string, root: TransformNode): Mesh {
    const TW = 512, TH = 128;

    const label = MeshBuilder.CreatePlane(`mp-label-${callsign}`,
      { width: 32, height: 8 }, this.scene);
    label.parent = root;
    label.position.y = 10;
    label.billboardMode = Mesh.BILLBOARDMODE_ALL;
    label.isPickable = false;

    const dt  = new DynamicTexture(`mp-labelTex-${callsign}`,
      { width: TW, height: TH }, this.scene, false);
    dt.hasAlpha = true;

    const ctx = dt.getContext() as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, TW, TH);

    // Dark rounded-rect background for contrast against any sky/terrain
    const pad = 10, r = 16;
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.beginPath();
    ctx.moveTo(pad + r, pad);
    ctx.lineTo(TW - pad - r, pad);
    ctx.arcTo(TW - pad, pad,       TW - pad,      pad + r,      r);
    ctx.lineTo(TW - pad, TH - pad - r);
    ctx.arcTo(TW - pad, TH - pad,  TW - pad - r,  TH - pad,     r);
    ctx.lineTo(pad + r,  TH - pad);
    ctx.arcTo(pad,       TH - pad,  pad,           TH - pad - r, r);
    ctx.lineTo(pad,      pad + r);
    ctx.arcTo(pad,       pad,       pad + r,       pad,          r);
    ctx.closePath();
    ctx.fill();

    // Callsign — large white text
    ctx.fillStyle    = '#ffffff';
    ctx.font         = 'bold 42px monospace';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(callsign, TW / 2, 72);

    // Plane name — smaller orange text below callsign
    ctx.fillStyle = '#ff9900';
    ctx.font      = '26px monospace';
    ctx.fillText(planeName, TW / 2, 108);

    dt.update();

    const mat = new StandardMaterial(`mp-labelMat-${callsign}`, this.scene);
    mat.diffuseColor    = Color3.Black();
    mat.emissiveTexture = dt;
    mat.backFaceCulling = false;
    label.material = mat;

    return label;
  }

  private removeOtherPlayer(id: string): void {
    const op = this.otherPlayers.get(id);
    if (!op) return;
    op.meshes.forEach(m => m.dispose());
    op.label.dispose();
    op.root.dispose();
    this.otherPlayers.delete(id);
  }

  private handleCrash(message: string): void {
    if (this.crashed) return; // guard: crash detection can fire twice in one frame
    this.triggerCrashAnimation();
    this.crashed      = true;
    this.crashMessage = message;
    this.speed        = 0;
    this.velocity.setAll(0);
    this.rotVelocity.setAll(0);
    // Delay the overlay so the explosion plays for ~2 seconds first
    setTimeout(() => this.ngZone.run(() => { this.crashBoxVisible = true; }), 2000);
    // Switch to 3rd-person so the wreckage is visible
    if (this.scene.activeCamera !== this.orbitCamera) {
      this.scene.activeCamera = this.orbitCamera;
      this.orbitCamera.attachControl(this.canvasRef.nativeElement, true);
      this.cameraMode = '3rd Person';
    }
  }

  // ── Debris physics (runs every frame even when crashed) ──────────────────
  private updateDebris(dt: number): void {
    for (const p of this.debrisPieces) {
      p.velocity.y -= 14 * dt;                             // gravity
      p.mesh.position.addInPlace(p.velocity.scale(dt));   // integrate position
      // Ground bounce / friction
      if (p.mesh.position.y < 0.08) {
        p.mesh.position.y = 0.08;
        p.velocity.y = Math.abs(p.velocity.y) * 0.20;    // small bounce
        p.velocity.x *= 0.80;
        p.velocity.z *= 0.80;
        if (Math.abs(p.velocity.y) < 0.5 &&
            p.velocity.x * p.velocity.x + p.velocity.z * p.velocity.z < 0.4) {
          p.velocity.copyFromFloats(0, 0, 0);
        }
      }
      // Damp spin (pieces stop tumbling after a few seconds)
      p.angularVelocity.scaleInPlace(Math.max(0, 1 - 1.6 * dt));
      const dq = Quaternion.RotationYawPitchRoll(
        p.angularVelocity.y * dt,
        p.angularVelocity.x * dt,
        p.angularVelocity.z * dt,
      );
      p.mesh.rotationQuaternion = (p.mesh.rotationQuaternion ?? Quaternion.Identity()).multiply(dq);
    }
  }

  // ── Crash explosion — scatter parts + start fire / smoke ─────────────────
  private triggerCrashAnimation(): void {
    const crashPos      = this.planeMesh.position.clone();
    const crashVelocity = this.velocity.clone();

    // Detach all plane parts and turn them into physics debris
    const allParts = [...this.planeParts, ...this.cockpitParts];
    this.planeParts   = [];
    this.cockpitParts = [];
    this.propMeshes   = [];

    for (const mesh of allParts) {
      // Capture world-space transform before removing parent
      const worldPos  = mesh.getAbsolutePosition().clone();
      const worldQuat = mesh.absoluteRotationQuaternion.clone();
      mesh.parent             = null;
      mesh.position           = worldPos;
      mesh.rotationQuaternion = worldQuat;
      mesh.layerMask          = 0x0FFFFFFF; // visible in orbit (3rd-person) camera

      // Velocity: forward momentum from crash velocity + random scatter + upward burst
      const vel = new Vector3(
        crashVelocity.x * 0.10 + (Math.random() - 0.5) * 26,
        3 + Math.random() * 22,
        crashVelocity.z * 0.10 + (Math.random() - 0.5) * 26,
      );
      const ang = new Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
      );
      this.debrisPieces.push({ mesh, velocity: vel, angularVelocity: ang });
    }

    // ── Fire texture (white-hot core → orange → dark red, transparent edge) ─
    const fireTex = new DynamicTexture('crashFireTex', { width: 64, height: 64 }, this.scene, false);
    const fCtx    = fireTex.getContext();
    const fGrad   = fCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    fGrad.addColorStop(0,    'rgba(255, 255, 210, 1.0)');
    fGrad.addColorStop(0.30, 'rgba(255, 130, 20,  0.9)');
    fGrad.addColorStop(0.65, 'rgba(200, 40,  5,   0.55)');
    fGrad.addColorStop(1,    'rgba(120, 10,  0,   0)');
    fCtx.fillStyle = fGrad as unknown as string;
    fCtx.beginPath(); fCtx.arc(32, 32, 32, 0, Math.PI * 2); fCtx.fill();
    fireTex.update();

    // ── Smoke texture (soft grey puff) ────────────────────────────────────
    const smokeTex = new DynamicTexture('crashSmokeTex', { width: 64, height: 64 }, this.scene, false);
    const sCtx     = smokeTex.getContext();
    const sGrad    = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sGrad.addColorStop(0,    'rgba(55, 55, 55, 0.85)');
    sGrad.addColorStop(0.55, 'rgba(40, 40, 40, 0.50)');
    sGrad.addColorStop(1,    'rgba(20, 20, 20, 0)');
    sCtx.fillStyle = sGrad as unknown as string;
    sCtx.beginPath(); sCtx.arc(32, 32, 32, 0, Math.PI * 2); sCtx.fill();
    smokeTex.update();

    // ── Sustained fire ────────────────────────────────────────────────────
    this.fireSystem = new ParticleSystem('crashFire', 450, this.scene);
    this.fireSystem.particleTexture = fireTex;
    this.fireSystem.emitter         = crashPos.clone();
    this.fireSystem.minEmitBox      = new Vector3(-1.0, 0,    -1.0);
    this.fireSystem.maxEmitBox      = new Vector3( 1.0, 0.5,   1.0);
    this.fireSystem.direction1      = new Vector3(-2.5,  9,  -2.5);
    this.fireSystem.direction2      = new Vector3( 2.5, 16,   2.5);
    this.fireSystem.minLifeTime     = 0.20;
    this.fireSystem.maxLifeTime     = 0.80;
    this.fireSystem.emitRate        = 200;
    this.fireSystem.minSize         = 0.8;
    this.fireSystem.maxSize         = 3.0;
    this.fireSystem.minInitialRotation = 0;
    this.fireSystem.maxInitialRotation = Math.PI * 2;
    this.fireSystem.color1          = new Color4(1.0,  0.70, 0.10, 1.0);
    this.fireSystem.color2          = new Color4(1.0,  0.28, 0.04, 0.90);
    this.fireSystem.colorDead       = new Color4(0.04, 0.04, 0.04, 0.0);
    this.fireSystem.blendMode       = ParticleSystem.BLENDMODE_ADD;
    this.fireSystem.start();

    // ── Smoke plume ───────────────────────────────────────────────────────
    this.smokeSystem = new ParticleSystem('crashSmoke', 220, this.scene);
    this.smokeSystem.particleTexture = smokeTex;
    this.smokeSystem.emitter         = crashPos.clone();
    this.smokeSystem.minEmitBox      = new Vector3(-2,   1.5, -2);
    this.smokeSystem.maxEmitBox      = new Vector3( 2,   3.5,  2);
    this.smokeSystem.direction1      = new Vector3(-2,   7,   -2);
    this.smokeSystem.direction2      = new Vector3( 2,  14,    2);
    this.smokeSystem.minLifeTime     = 2.5;
    this.smokeSystem.maxLifeTime     = 6.5;
    this.smokeSystem.emitRate        = 38;
    this.smokeSystem.minSize         = 3.0;
    this.smokeSystem.maxSize         = 9.5;
    this.smokeSystem.minInitialRotation = 0;
    this.smokeSystem.maxInitialRotation = Math.PI * 2;
    this.smokeSystem.color1          = new Color4(0.15, 0.15, 0.15, 0.75);
    this.smokeSystem.color2          = new Color4(0.22, 0.22, 0.22, 0.55);
    this.smokeSystem.colorDead       = new Color4(0.32, 0.32, 0.32, 0.0);
    this.smokeSystem.start();
  }

  restart(): void {
    // Dispose debris and stop fire/smoke effects from the crash
    for (const p of this.debrisPieces) p.mesh.dispose();
    this.debrisPieces = [];
    this.fireSystem?.stop();  this.fireSystem?.dispose();  this.fireSystem  = null;
    this.smokeSystem?.stop(); this.smokeSystem?.dispose(); this.smokeSystem = null;
    this.crashBoxVisible = false;

    this.planeMesh.position           = new Vector3(0, this.GROUND_OFFSET, -900);
    this.planeMesh.rotationQuaternion = Quaternion.Identity();
    this.speed        = 0;
    this.velocity.setAll(0);
    this.rotVelocity.setAll(0);
    this.throttle     = 0;
    this.stalling     = false;
    this.crashed      = false;
    this.crashMessage = '';
    this.keys.clear();
    this.cockpitLookH      = 0;
    this.cockpitLookV      = 0;
    this.isCockpitDragging = false;
    this.orbitCamera.target.copyFrom(this.planeMesh.position);
    this.lastFetchPos = null;
    this.landed = true; this.landedAt = 'Central International Airport'; this.landingMsg = ''; this.landingMsgTimer = 0; this.liftoffGraceTimer = 0;
    this.fetchStructures();
    // Re-build plane geometry — crash animation disposed all parts as debris
    this.fetchPlane(this.selectedPlaneSlug);
  }

  logout(): void {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['/login']);
  }

  toggleCamera(): void {
    const canvas = this.canvasRef.nativeElement;
    if (this.scene.activeCamera === this.orbitCamera) {
      this.orbitCamera.detachControl();
      this.scene.activeCamera = this.cockpitCamera;
      this.cockpitLookH       = 0;   // always enter cockpit looking straight ahead
      this.cockpitLookV       = 0;
      this.cameraMode         = '1st Person';
    } else {
      this.isCockpitDragging  = false;
      this.scene.activeCamera = this.orbitCamera;
      this.orbitCamera.attachControl(canvas, true);
      this.cameraMode         = '3rd Person';
    }
  }

  // ── Plane loading ─────────────────────────────────────────────────────────

  private fetchPlanes(): void {
    fetch(`${Settings.apiUrl}planes/`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<PlaneSummary[]>; })
      .then(planes => this.ngZone.run(() => { this.availablePlanes = planes; }))
      .catch(() => {});
  }

  private fetchPlane(slug?: string): void {
    const url = slug ? `${Settings.apiUrl}planes/${slug}` : `${Settings.apiUrl}planes/default`;
    fetch(url)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<GamePlane>; })
      .then(plane => this.ngZone.run(() => this.buildPlaneFromData(plane)))
      .catch(() => { /* server offline — fly with invisible hull */ });
  }

  selectPlane(slug: string): void {
    this.selectedPlaneSlug = slug;
    localStorage.setItem('selectedPlane', slug);
    this.planeSelectorOpen = false;
    this.fetchPlane(slug);
    this.resetFlight();
  }

  private resetFlight(): void {
    this.speed    = 0;
    this.velocity.setAll(0);
    this.rotVelocity.setAll(0);
    this.throttle = 0;
    this.crashed   = false;
    this.stalling  = false;
    this.planeMesh.position = new Vector3(0, this.GROUND_OFFSET, -900);
    this.planeMesh.rotationQuaternion = Quaternion.Identity();
    this.landed = true; this.landedAt = 'Central International Airport'; this.landingMsg = ''; this.landingMsgTimer = 0; this.liftoffGraceTimer = 0;
  }

  private buildPlaneFromData(plane: GamePlane): void {
    // Dispose previously built parts (e.g. on hot-reload or future plane swap)
    for (const m of this.planeParts)   m.dispose();
    for (const m of this.cockpitParts) m.dispose();
    this.planeParts   = [];
    this.cockpitParts = [];
    this.propMeshes   = [];
    this.planeTexCache.clear();

    const PLANE_LAYER   = 0x10000000;
    const COCKPIT_LAYER = 0x20000000;

    const buildMesh = (part: PlanePart, layerMask: number): Mesh => {
      let mesh: Mesh;
      if (part.shape === 'cylinder') {
        mesh = MeshBuilder.CreateCylinder(part.id, {
          height:         part.params['height']        ?? 1,
          diameter:       part.params['diameter'],
          diameterTop:    part.params['diameterTop'],
          diameterBottom: part.params['diameterBottom'],
          tessellation:   part.params['tessellation']  ?? 12,
        }, this.scene);
      } else {
        mesh = MeshBuilder.CreateBox(part.id, {
          width:  part.params['width']  ?? 1,
          height: part.params['height'] ?? 1,
          depth:  part.params['depth']  ?? 1,
        }, this.scene);
      }
      mesh.position  = new Vector3(part.position.x, part.position.y, part.position.z);
      if (part.rotation) {
        mesh.rotation = new Vector3(part.rotation.x, part.rotation.y, part.rotation.z);
      }
      mesh.parent    = this.planeMesh;
      mesh.layerMask = layerMask;
      mesh.material  = this.buildPlanePartMaterial(part.material);
      return mesh;
    };

    this.ROT_SPEED         = 1.4;   // reset to Cessna defaults before per-plane override
    this.THROTTLE_RATE     = 0.40;
    this.WEIGHT            = 1.0;  // reset before per-plane override
    this.machineGunsEnabled = false;
    this.gunPositions       = [];
    // Bomb bay — reset state and dispose any doors from the previous plane
    this.bombBayEnabled  = false;
    this.bombPositions   = [];
    this.bombBayOpen     = false;
    this.bombBayAngle    = 0;
    this.nextBombPos     = 0;
    this.disposeBombBayDoors();
    // Landing gear — reset state before per-plane override
    this.retractableGear       = false;
    this.gearDown              = true;
    this.gearMeshes            = [];
    this.gearOriginalPositions = [];
    this.gearAnimProgress      = 0;
    this.gearAnimTarget        = 0;
    if (plane.physics) {
      this.INITIAL_SPEED    = plane.physics.initialSpeed;
      this.INITIAL_THROTTLE = plane.physics.initialThrottle;
      this.ACCELERATION     = plane.physics.acceleration;
      this.DRAG_K           = plane.physics.dragK;
      this.MAX_SPEED        = plane.physics.maxSpeed;
      this.LIFT_K           = plane.physics.liftK;
      this.STALL_SPEED      = plane.physics.stallSpeed;
      this.WEIGHT           = plane.physics.weight ?? 1.0;
      this.GROUND_OFFSET    = plane.physics.groundOffset ?? 1.60;
      this.ROT_SPEED        = plane.physics.rotSpeed      ?? 1.4;
      this.THROTTLE_RATE    = plane.physics.throttleRate  ?? 0.40;
      this.machineGunsEnabled = plane.physics.machineGunsEnabled ?? false;
      this.gunPositions       = plane.physics.gunPositions ?? [];
      this.bombBayEnabled     = plane.physics.bombBayEnabled  ?? false;
      this.bombPositions      = plane.physics.bombPositions   ?? [];
      this.retractableGear    = plane.physics.retractableGear ?? false;
    }
    const cp = plane.physics?.cockpitCameraPos;
    this.cockpitCamera.position = new Vector3(cp?.x ?? 0, cp?.y ?? 0.44, cp?.z ?? 3.2);
    this.planeName = plane.name;

    for (const part of plane.parts) {
      const mesh = buildMesh(part, PLANE_LAYER);
      if (part.isProp) this.propMeshes.push(mesh);
      this.planeParts.push(mesh);
    }

    // Collect gear meshes for retraction animation
    if (this.retractableGear) {
      for (const mesh of this.planeParts) {
        if (/gear|wheel/i.test(mesh.name)) {
          this.gearMeshes.push(mesh);
          this.gearOriginalPositions.push(mesh.position.clone());
        }
      }
    }

    for (const part of (plane.cockpitParts ?? [])) {
      const mesh = buildMesh(part, COCKPIT_LAYER);
      if (part.isProp) this.propMeshes.push(mesh);
      this.cockpitParts.push(mesh);
    }

    // Restrict the cockpit light to interior meshes so it doesn't
    // cast onto the airframe or world in third-person view.
    if (this.cockpitLight && this.cockpitParts.length > 0) {
      this.cockpitLight.includedOnlyMeshes = [...this.cockpitParts];
    }

    // Build bomb bay doors after plane geometry is ready
    if (this.bombBayEnabled) this.buildBombBayDoors();
  }

  private buildPlanePartMaterial(
    mat: { color: string; specular?: string; texture?: string; alpha?: number }
  ): StandardMaterial {
    const key = mat.texture ?? `solid_${mat.color}`;
    const m   = new StandardMaterial(`planeMat_${key}_${Date.now()}`, this.scene);

    const hexToColor3 = (hex: string): Color3 => new Color3(
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    );

    if (mat.texture) {
      m.diffuseTexture = this.getOrBuildPlaneTexture(mat.texture);
    } else {
      m.diffuseColor = hexToColor3(mat.color);
    }

    m.specularColor = mat.specular ? hexToColor3(mat.specular) : new Color3(0.2, 0.2, 0.2);

    if (mat.alpha !== undefined) {
      m.alpha           = mat.alpha;
      m.backFaceCulling = false;
    }
    return m;
  }

  private getOrBuildPlaneTexture(hint: string): DynamicTexture {
    if (this.planeTexCache.has(hint)) return this.planeTexCache.get(hint)!;
    const tex = this.buildPlaneTexture(hint);
    this.planeTexCache.set(hint, tex);
    return tex;
  }

  private buildPlaneTexture(hint: string): DynamicTexture {
    switch (hint) {
      case 'cessna_body': {
        const tex = new DynamicTexture('cessnaBodyTex', { width: 512, height: 256 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#F2F2F0'; ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = '#C8A832'; ctx.fillRect(0, 166, 512, 8);   // gold accent
        ctx.fillStyle = '#CC3311'; ctx.fillRect(0, 174, 512, 52);  // red/orange band
        ctx.fillStyle = '#C8A832'; ctx.fillRect(0, 226, 512, 8);   // gold border
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'cessna_wing': {
        const tex = new DynamicTexture('cessnaWingTex', { width: 512, height: 64 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#EEEEEC'; ctx.fillRect(0, 0, 512, 64);
        ctx.fillStyle = '#CC3311'; ctx.fillRect(0, 0, 512, 12);    // leading-edge stripe
        ctx.fillStyle = '#C8A832'; ctx.fillRect(0, 12, 512, 4);    // gold trim
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'metal': {
        const tex = new DynamicTexture('metalTex', { width: 128, height: 128 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#909090'; ctx.fillRect(0, 0, 128, 128);
        const g = ctx.createLinearGradient(0, 0, 0, 128);
        g.addColorStop(0,   'rgba(255,255,255,0.18)');
        g.addColorStop(0.5, 'rgba(255,255,255,0)');
        g.addColorStop(1,   'rgba(0,0,0,0.12)');
        ctx.fillStyle = g as unknown as string; ctx.fillRect(0, 0, 128, 128);
        tex.update();
        return tex;
      }
      case 'propeller': {
        const tex = new DynamicTexture('propTex', { width: 64, height: 512 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#2A2A2A'; ctx.fillRect(0, 0, 64, 512);
        ctx.fillStyle = '#FFCC00'; ctx.fillRect(0, 0, 64, 55);     // tip markers
        ctx.fillStyle = '#FFCC00'; ctx.fillRect(0, 457, 64, 55);
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'tire': {
        const tex = new DynamicTexture('tireTex', { width: 64, height: 64 }, this.scene, false);
        tex.getContext().fillStyle = '#1C1C1C';
        tex.getContext().fillRect(0, 0, 64, 64);
        tex.update();
        return tex;
      }
      case 'cockpit_panel': {
        // Fake instrument cluster — circles suggest gauges without being functional
        const W = 512, H = 256;
        const tex = new DynamicTexture('cockpitPanelTex', { width: W, height: H }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, 0, W, H);
        // Main gauge row
        const gauges = [[70,95],[158,95],[246,95],[334,95],[422,95]];
        for (const [cx, cy] of gauges) {
          ctx.strokeStyle = '#484848'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = '#0D0D0D';
          ctx.beginPath(); ctx.arc(cx, cy, 37, 0, Math.PI*2); ctx.fill();
          for (let i = 0; i < 12; i++) {
            const a = (i/12)*Math.PI*2, r1=30, r2=i%3===0?24:27;
            ctx.strokeStyle = i%3===0 ? '#AAAAAA' : '#555555'; ctx.lineWidth = i%3===0?2:1;
            ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
            ctx.lineTo(cx+Math.cos(a)*r2, cy+Math.sin(a)*r2); ctx.stroke();
          }
          const na = -0.8 + (cx/W)*2.5;
          ctx.strokeStyle = '#EEEEEE'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+Math.cos(na)*26, cy+Math.sin(na)*26); ctx.stroke();
          ctx.fillStyle = '#888888'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
        }
        // Secondary gauge row
        const small = [[70,195],[145,195],[220,195],[310,200],[390,200],[470,200]];
        for (const [cx, cy] of small) {
          ctx.strokeStyle = '#383838'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = '#0A0A0A';
          ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI*2); ctx.fill();
          const na = 0.4 + (cx/W)*1.5;
          ctx.strokeStyle = '#CCCCCC'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+Math.cos(na)*16, cy+Math.sin(na)*16); ctx.stroke();
        }
        // Switch panels
        ctx.fillStyle = '#222222'; ctx.fillRect(320,155,80,35); ctx.fillRect(420,155,75,35);
        for (const [sx, col] of [[328,'#CC3311'],[348,'#117733'],[368,'#CC9900'],[428,'#CC3311'],[448,'#117733']]) {
          ctx.fillStyle = col as string; ctx.fillRect(sx as number, 163, 14, 10);
        }
        tex.update();
        return tex;
      }
      case 'cockpit_interior': {
        const tex = new DynamicTexture('cockpitIntTex', { width: 256, height: 256 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#BDB5A8'; ctx.fillRect(0, 0, 256, 256);
        for (let y = 0; y < 256; y += 18) {
          ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
        }
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'cockpit_floor': {
        const tex = new DynamicTexture('cockpitFloorTex', { width: 128, height: 128 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#2C2C2C'; ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 32; i++) {
          const v = 35 + Math.floor((i * 37) % 12);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect((i*13)%128, (i*19)%128, 8, 8);
        }
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'king_air_body': {
        const tex = new DynamicTexture('kingAirBodyTex', { width: 512, height: 256 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#EEEFED'; ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = '#1C3A6E'; ctx.fillRect(0, 130, 512, 80);  // navy blue band
        ctx.fillStyle = '#C8C8C6'; ctx.fillRect(0, 125, 512, 5);   // silver border top
        ctx.fillStyle = '#C8C8C6'; ctx.fillRect(0, 210, 512, 5);   // silver border bottom
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'p51_body': {
        const tex = new DynamicTexture('p51BodyTex', { width: 512, height: 256 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#D0D0D0'; ctx.fillRect(0, 0, 512, 256);           // aluminium base
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0,   'rgba(255,255,255,0.20)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        g.addColorStop(1,   'rgba(0,0,0,0.10)');
        ctx.fillStyle = g as unknown as string; ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = '#FFCC00'; ctx.fillRect(0, 0, 80, 256);            // yellow nose band
        ctx.fillStyle = '#C8A832'; ctx.fillRect(80, 0, 6, 256);            // gold border
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'b17_body': {
        const tex = new DynamicTexture('b17BodyTex', { width: 512, height: 256 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#4B5320'; ctx.fillRect(0, 0, 512, 256);           // olive drab upper
        ctx.fillStyle = '#8A8A78'; ctx.fillRect(0, 180, 512, 76);          // neutral grey underside
        ctx.fillStyle = '#3A4218'; ctx.fillRect(0, 175, 512, 5);           // panel line
        for (let i = 0; i < 512; i += 64) {
          ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 180); ctx.stroke();
        }
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      case 'b17_wing': {
        const tex = new DynamicTexture('b17WingTex', { width: 512, height: 64 }, this.scene, false);
        const ctx = tex.getContext();
        ctx.fillStyle = '#4B5320'; ctx.fillRect(0, 0, 512, 64);            // olive drab
        ctx.fillStyle = '#8A8A78'; ctx.fillRect(0, 44, 512, 20);           // grey underside band
        for (let i = 0; i < 512; i += 80) {
          ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 44); ctx.stroke();
        }
        tex.update(); tex.wrapU = tex.wrapV = 1;
        return tex;
      }
      default: {
        const tex = new DynamicTexture(`planeTex_${hint}`, { width: 64, height: 64 }, this.scene, false);
        tex.getContext().fillStyle = '#AAAAAA';
        tex.getContext().fillRect(0, 0, 64, 64);
        tex.update();
        return tex;
      }
    }
  }

  private fetchWeather(): void {
    fetch(`${Settings.apiUrl}weather`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GameWeather>;
      })
      .then(w => this.ngZone.run(() => {
        this.weather           = w;
        this.scene.fogDensity  = w.fog.density;
        if (this.rainSystem) {
          if (w.precipitation === 'rain') this.rainSystem.start();
          else                            this.rainSystem.stop();
        }
        // Tilt rain direction to match wind
        if (this.rainSystem) {
          const tilt = 0.06;
          this.rainSystem.direction1 = new Vector3(w.wind.x * tilt - 4, -28, w.wind.z * tilt - 4);
          this.rainSystem.direction2 = new Vector3(w.wind.x * tilt + 4, -22, w.wind.z * tilt + 4);
        }
      }))
      .catch(() => { /* server offline — keep current conditions */ });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Procedural texture helpers
  // ──────────────────────────────────────────────────────────────────────

  private createGrassTexture(scene: Scene): DynamicTexture {
    const size = 512;
    const tex  = new DynamicTexture('grassTex', { width: size, height: size }, scene, true);
    const ctx  = tex.getContext();

    // Base green
    ctx.fillStyle = '#2d7a2d';
    ctx.fillRect(0, 0, size, size);

    // Random variation patches for a non-uniform look
    for (let i = 0; i < 120; i++) {
      const g = 80 + Math.floor(Math.random() * 60);
      ctx.fillStyle = `rgb(20, ${g}, 20)`;
      ctx.fillRect(
        Math.floor(Math.random() * size), Math.floor(Math.random() * size),
        10 + Math.floor(Math.random() * 50), 10 + Math.floor(Math.random() * 50)
      );
    }

    // Subtle field-boundary grid
    ctx.strokeStyle = 'rgba(30, 100, 30, 0.3)';
    ctx.lineWidth   = 2;
    for (let n = 0; n <= size; n += 128) {
      ctx.beginPath(); ctx.moveTo(n, 0);    ctx.lineTo(n, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, n);    ctx.lineTo(size, n); ctx.stroke();
    }

    tex.update();
    tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  /** Dense dark-green forest floor with textural variation. */
  private createForestTexture(scene: Scene): DynamicTexture {
    const size = 512;
    const tex  = new DynamicTexture('forestTex', { width: size, height: size }, scene, false);
    const ctx  = tex.getContext();
    ctx.fillStyle = '#2D5A1B';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      const r = Math.random() * 5 + 1;
      const g = Math.floor(Math.random() * 35 + 25);
      ctx.fillStyle = `rgba(8, ${g}, 8, 0.55)`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    tex.update();
    tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  /** Alternating crop rows in shades of yellow-green. */
  private createFarmTexture(scene: Scene): DynamicTexture {
    const size = 512;
    const tex  = new DynamicTexture('farmTex', { width: size, height: size }, scene, false);
    const ctx  = tex.getContext();
    const rowH = 24;
    for (let row = 0; row < size / rowH; row++) {
      ctx.fillStyle = row % 2 === 0 ? '#8B9E3A' : '#B5C44A';
      ctx.fillRect(0, row * rowH, size, rowH);
    }
    // Faint vertical furrows
    ctx.strokeStyle = 'rgba(100, 90, 30, 0.18)';
    ctx.lineWidth   = 1;
    for (let x = 0; x < size; x += 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
    }
    tex.update();
    tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  /** Sandy arid terrain with subtle speckle. */
  private createAridTexture(scene: Scene): DynamicTexture {
    const size = 512;
    const tex  = new DynamicTexture('aridTex', { width: size, height: size }, scene, false);
    const ctx  = tex.getContext();
    ctx.fillStyle = '#C8A96E';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 600; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      const r = Math.random() * 4 + 1;
      const v = Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgba(180, ${140 + v}, 90, 0.55)`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    tex.update();
    tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  /** Warm concrete wall with randomly lit/dark yellow windows (4 cols × 8 rows). */
  private createBuildingWindowTexture(scene: Scene): DynamicTexture {    const w = 256, h = 512;
    const tex = new DynamicTexture('bldTex', { width: w, height: h }, scene, true);
    const ctx = tex.getContext();

    ctx.fillStyle = '#b0a494'; ctx.fillRect(0, 0, w, h);

    const cols = 4, rows = 8;
    const rowH = h / rows;
    // Floor dividers
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1;
    for (let r = 1; r < rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.round(r * rowH)); ctx.lineTo(w, Math.round(r * rowH));
      ctx.stroke();
    }
    // Windows
    const margin = 12;
    const winW   = Math.floor((w - margin * (cols + 1)) / cols);
    const winH   = Math.floor(rowH * 0.55);
    const padY   = Math.floor((rowH - winH) / 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = margin + c * (winW + margin);
        const y = Math.round(r * rowH) + padY;
        ctx.fillStyle = '#333';                              ctx.fillRect(x, y, winW, winH);
        ctx.fillStyle = Math.random() > 0.25 ? '#ffe0a0' : '#2a3e55';   // lit or dark
        ctx.fillRect(x + 2, y + 2, winW - 4, winH - 4);
        // cross divider
        ctx.fillStyle = '#333';
        ctx.fillRect(x + Math.floor(winW / 2) - 1, y, 2, winH);
        ctx.fillRect(x, y + Math.floor(winH / 2) - 1, winW, 2);
      }
    }

    tex.update(); tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  /** Steel-grey wall with blue-tinted windows (2 cols × 10 rows) for towers. */
  private createTowerWindowTexture(scene: Scene): DynamicTexture {
    const w = 128, h = 512;
    const tex = new DynamicTexture('towerTex', { width: w, height: h }, scene, true);
    const ctx = tex.getContext();

    ctx.fillStyle = '#9aa0a8'; ctx.fillRect(0, 0, w, h);

    const cols = 2, rows = 10;
    const rowH = h / rows;
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    for (let r = 1; r < rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.round(r * rowH)); ctx.lineTo(w, Math.round(r * rowH));
      ctx.stroke();
    }
    const margin = 10;
    const winW   = Math.floor((w - margin * (cols + 1)) / cols);
    const winH   = Math.floor(rowH * 0.52);
    const padY   = Math.floor((rowH - winH) / 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = margin + c * (winW + margin);
        const y = Math.round(r * rowH) + padY;
        ctx.fillStyle = '#2a3040';                              ctx.fillRect(x, y, winW, winH);
        ctx.fillStyle = Math.random() > 0.2 ? '#c0d8ff' : '#0a1830';
        ctx.fillRect(x + 2, y + 2, winW - 4, winH - 4);
      }
    }
    // Vertical accent stripe
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(Math.floor(w / 2) - 1, 0, 3, h);

    tex.update(); tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  /** Corrugated metal look for hangars. */
  private createHangarTexture(scene: Scene): DynamicTexture {
    const w = 512, h = 128;
    const tex = new DynamicTexture('hangarTex', { width: w, height: h }, scene, true);
    const ctx = tex.getContext();

    // Horizontal corrugation bands (alternating highlight/shadow)
    const bands = 18;
    for (let i = 0; i < bands; i++) {
      const y1  = Math.round((i       / bands) * h);
      const mid = Math.round((i + 0.5 / bands) * h + 2);
      const y2  = Math.round(((i + 1) / bands) * h);
      ctx.fillStyle = '#7e8a8a'; ctx.fillRect(0, y1,  w, mid - y1);
      ctx.fillStyle = '#52605e'; ctx.fillRect(0, mid, w, y2 - mid);
    }

    // Vertical support ribs
    ctx.fillStyle = 'rgba(40, 50, 48, 0.55)';
    for (let x = 0; x < w; x += 64) {
      ctx.fillRect(x, 0, 3, h);
    }

    tex.update(); tex.wrapU = 1; tex.wrapV = 1;
    return tex;
  }

  ngOnDestroy(): void {
    if (this.weatherRefreshId !== null) clearInterval(this.weatherRefreshId);
    window.removeEventListener('keydown',   this.boundKeyDown);
    window.removeEventListener('keyup',     this.boundKeyUp);
    window.removeEventListener('resize',    this.boundResize);
    window.removeEventListener('pointerup', this.boundPointerUp);
    for (const m of this.planeParts)   m.dispose();
    for (const m of this.cockpitParts) m.dispose();
    for (const p of this.debrisPieces) p.mesh.dispose();
    for (const m of this.terrainMeshes.values()) m.dispose();
    for (const trees of this.treeMeshes.values()) trees.forEach(t => t.dispose());
    for (const m of this.roadMeshes.values()) m.dispose();
    for (const meshes of this.airportMeshes.values()) meshes.forEach(m => m.dispose());
    // Multiplayer cleanup
    if (this.multiWs) { this.multiWs.close(); this.multiWs = null; }
    for (const [id] of this.otherPlayers) this.removeOtherPlayer(id);
    // Weapon cleanup
    for (const t of this.tracerRounds) t.mesh.dispose();
    this.tracerRounds = [];
    // Bomb cleanup
    for (const b of this.bombs) b.root.dispose();
    this.bombs = [];
    for (const e of this.explosions) { e.fire.dispose(); e.smoke.dispose(); }
    this.explosions = [];
    this.disposeBombBayDoors();
    this.fireSystem?.dispose();
    this.smokeSystem?.dispose();
    this.engine?.dispose();
  }
}
