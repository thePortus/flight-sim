'use strict';

const { Town } = require('../models');

exports.getTowns = async (req, res) => {
  try {
    const towns = await Town.findAll({ order: [['id', 'ASC']] });
    res.json(towns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
