'use strict';

const { Airport, Runway } = require('../models');

exports.getAirports = async (req, res) => {
  try {
    const airports = await Airport.findAll({
      include: [{ model: Runway, as: 'runways' }],
      order:   [['id', 'ASC']],
    });
    res.json(airports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
