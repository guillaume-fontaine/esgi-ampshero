const express = require('express');
const passport = require("passport");
const Amplifier = require("../models/Amplifier");
const Preset = require("../models/Preset");
const router = express.Router();

// GET /amplifiers Retourner la liste des amplis
router.get('/', async (req, res) => {
  // #swagger.summary = 'Get all amps'
  // #swagger.description = 'Get all amps'
  // #swagger.parameters['page'] = {description: 'Page number (default 0)', type: 'number'}
  // #swagger.parameters['limit'] = {description: 'Elements per page (default 2)', type: 'number'}
  // #swagger.parameters['brand'] = {description: 'Brand id', type: 'string'}
  let { page, limit, brand } = req.query;
  let filters = {};

  page = isNaN(page) ? 1 : parseInt(page);
  limit = isNaN(limit) ? 2 : parseInt(limit);

  if (brand) {
    filters.brand = brand;
  }

  const amplifiers = await Amplifier.find().populate('brand', 'name').where(filters).limit(limit).skip((page - 1) * limit);
  const total = await Amplifier.where(filters).countDocuments();

  res.json({
    page,
    "hydra:totalItems": total,
    "hydra:members": amplifiers
  });
});

// POST /amplifiers Créer un nouvel ampli
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(402).json({ error: 'Unauthorized' });
  }
  try {
    const amplifier = await Amplifier.create(req.body);
    res.status(201).json(amplifier);
  } catch (e) {
    res.status(400).json(e);
  }
});

// GET /amplifiers/1 Récupérer les données d'un ampli
router.get('/:id', async (req, res) => {
  const amplifier = await Amplifier.findById(req.params.id).populate(['brand', 'presets', 'presets.user']);

  if(amplifier) {
    res.json(amplifier);
  } else {
    res.status(404).json({ 'error': 'Can\'t find amplifier' });
  }
});

// ...

// TODO: PATCH /amplifiers/1 Modifier les données d'un ampli
router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(402).json({ error: 'Unauthorized' });
  }

  try {
    const amplifier = await Amplifier.findById(req.params.id);

    if (!amplifier) {
      return res.status(404).json({ 'error': 'Amplifier not found' });
    }

    // Mettez à jour les propriétés nécessaires de l'amplificateur avec les données de req.body
    Object.assign(amplifier, req.body);

    // Sauvegardez les modifications dans la base de données
    await amplifier.save();

    res.status(200).json(amplifier);
  } catch (e) {
    res.status(400).json(e);
  }
});

// TODO: DELETE /amplifiers/1 Supprimer les données d'un ampli (🗑️ en supprimer également ses presets)
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(402).json({ error: 'Unauthorized' });
  }

  try {
    const amplifier = await Amplifier.findByIdAndDelete(req.params.id);

    if (!amplifier) {
      return res.status(404).json({ 'error': 'Amplifier not found' });
    }

    // Supprimer également les presets associés
    await Preset.deleteMany({ _id: { $in: amplifier.presets } });

    res.status(204).json({ message: 'Amplifier and associated presets successfully deleted!' });
  } catch (e) {
    res.status(400).json(e);
  }
});

// ...


module.exports = router;
