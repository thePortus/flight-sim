'use strict';

const { WebSocketServer } = require('ws');

/**
 * Attaches a WebSocket multiplayer server to an existing HTTP server.
 * Protocol (all messages are JSON strings):
 *
 *   Server → client on connect:
 *     { type: 'welcome',  id: string }
 *     { type: 'snapshot', players: PlayerState[] }   — existing players
 *
 *   Client → server (every ~100 ms):
 *     { type: 'update', x, y, z, qx, qy, qz, qw, planeName, callsign }
 *
 *   Server → all other clients on update:
 *     { type: 'update', id, x, y, z, qx, qy, qz, qw, planeName, callsign }
 *
 *   Server → all remaining clients on disconnect:
 *     { type: 'leave', id }
 */
function attachMultiplayer(server) {
  const wss = new WebSocketServer({ server });

  // players: id -> { ws, state | null }
  const players = new Map();
  let nextId = 1;

  wss.on('connection', (ws) => {
    const id = String(nextId++);
    players.set(id, { ws, state: null });

    // Tell new player their assigned ID
    ws.send(JSON.stringify({ type: 'welcome', id }));

    // Send snapshot of all currently-connected players that have sent at least one update
    const existing = [];
    for (const [pid, p] of players) {
      if (pid !== id && p.state) existing.push({ id: pid, ...p.state });
    }
    if (existing.length > 0) {
      ws.send(JSON.stringify({ type: 'snapshot', players: existing }));
    }

    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }

      // ── Bomb drop — relay to all other players ───────────────────────────
      if (msg.type === 'bomb') {
        const bombMsg = JSON.stringify({
          type: 'bomb',
          x:  +msg.x  || 0, y:  +msg.y  || 0, z:  +msg.z  || 0,
          vx: +msg.vx || 0, vy: +msg.vy || 0, vz: +msg.vz || 0,
        });
        for (const [pid, p] of players) {
          if (pid !== id && p.ws.readyState === 1 /* OPEN */) p.ws.send(bombMsg);
        }
        return;
      }

      // ── Gun fire salvo — relay to all other players ──────────────────────
      if (msg.type === 'fire') {
        // Sanitise: accept up to 8 gun origins; clamp all values to numbers
        const guns = Array.isArray(msg.guns)
          ? msg.guns.slice(0, 8).map(g => ({
              x:  +g.x  || 0, y:  +g.y  || 0, z:  +g.z  || 0,
              vx: +g.vx || 0, vy: +g.vy || 0, vz: +g.vz || 0,
            }))
          : [];
        const fireMsg = JSON.stringify({ type: 'fire', id, guns });
        for (const [pid, p] of players) {
          if (pid !== id && p.ws.readyState === 1 /* OPEN */) p.ws.send(fireMsg);
        }
        return;
      }

      if (msg.type !== 'update') return;

      // Validate and sanitise numeric fields to prevent injection
      const state = {
        x:         +msg.x         || 0,
        y:         +msg.y         || 0,
        z:         +msg.z         || 0,
        qx:        +msg.qx        || 0,
        qy:        +msg.qy        || 0,
        qz:        +msg.qz        || 0,
        qw:        +msg.qw        || 1,
        planeName: String(msg.planeName  ?? '').slice(0, 64),
        planeSlug: String(msg.planeSlug  ?? 'cessna-172').slice(0, 64),
        callsign:  String(msg.callsign   ?? '').slice(0, 32),
      };
      players.get(id).state = state;

      // Broadcast to every other connected player
      const broadcast = JSON.stringify({ type: 'update', id, ...state });
      for (const [pid, p] of players) {
        if (pid !== id && p.ws.readyState === 1 /* OPEN */) {
          p.ws.send(broadcast);
        }
      }
    });

    ws.on('close', () => {
      players.delete(id);
      const leave = JSON.stringify({ type: 'leave', id });
      for (const [, p] of players) {
        if (p.ws.readyState === 1) p.ws.send(leave);
      }
    });

    ws.on('error', () => {
      players.delete(id);
    });
  });

  console.log('Multiplayer WebSocket ready');
}

module.exports = { attachMultiplayer };
