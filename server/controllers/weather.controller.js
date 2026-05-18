'use strict';

/**
 * Compute time-based weather that changes over a 10-minute cycle.
 *
 * Using a deterministic function of wall-clock time means every connected
 * client always sees the same conditions simultaneously — no DB required.
 */
exports.getWeather = (req, res) => {
  const t      = Date.now() / 1000;      // epoch seconds
  const period = 600;                    // 10-minute weather cycle
  const phase  = (t % period) / period; // 0 → 1 over one cycle

  // Wind: direction rotates through 4π (two full turns) per cycle,
  //       speed oscillates between 5 and 26 u/s
  const windAngle = phase * Math.PI * 4;
  const windSpeed = 5 + 21 * Math.abs(Math.sin(phase * Math.PI * 5));
  const windX     = parseFloat((Math.cos(windAngle) * windSpeed).toFixed(2));
  const windZ     = parseFloat((Math.sin(windAngle) * windSpeed).toFixed(2));

  // Turbulence: 0–0.7, independent phase
  const turbulence = parseFloat(
    (Math.max(0, Math.sin(phase * Math.PI * 9)) * 0.7).toFixed(2)
  );

  // Fog: density 0.00004 (clear) → 0.00022 (thick haze), independent phase
  const fogDensity = parseFloat(
    (0.00004 + 0.00018 * Math.abs(Math.sin(phase * Math.PI * 3))).toFixed(6)
  );

  let description = 'Clear';
  if      (windSpeed > 22)      description = 'Stormy';
  else if (windSpeed > 15)      description = 'Windy';
  else if (turbulence > 0.35)   description = 'Gusty';
  else if (fogDensity > 0.00015) description = 'Foggy';

  res.json({
    wind:          { x: windX, z: windZ, speed: Math.round(windSpeed) },
    turbulence,
    fog:           { density: fogDensity },
    precipitation: windSpeed > 22 ? 'rain' : 'none',
    description,
  });
};
