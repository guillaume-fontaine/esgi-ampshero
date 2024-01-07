const express = require('express');
const passport = require("passport");
const Preset = require("../models/Preset");
const router = express.Router();


// TODO: GET /presets Retourner la liste des configurations (🔗 avec les données de l'utilisateur et l'ampli ⚙️ filtre par ampli + recherche partielle sur titre de musique)
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { amp, musicTitle } = req.query;
        let filters = {};

        if (amp) {
            filters.amp = amp;
        }

        if (musicTitle) {
            filters.musicTitle = { $regex: new RegExp(musicTitle, 'i') };
        }

        const presets = await Preset.find(filters)
            .populate('user', 'username')
            .populate('amp', 'name');

        res.json({ presets });
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: POST /presets Créer une nouvelle configuration (🔒 être connecté)
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const presetData = {
            ...req.body,
            user: req.user._id,
        };

        const preset = await Preset.create(presetData);
        res.status(201).json(preset);
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: GET /presets/1 Récupérer les données d'une configuration (🔗 avec les données de l'utilisateur et l'ampli)
router.get('/:id', async (req, res) => {
    try {
        const preset = await Preset.findById(req.params.id)
            .populate('user', 'username')
            .populate('amp', 'name');

        if (preset) {
            res.json(preset);
        } else {
            res.status(404).json({ 'error': 'Can\'t find preset' });
        }
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: PATCH /presets/1 Modifier les données d'une configuration (🔒 être connecté avec son propre compte ou admin)
router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const preset = await Preset.findById(req.params.id);

        if (!preset) {
            return res.status(404).json({ 'error': 'Preset not found' });
        }

        // Vérifier si l'utilisateur est propriétaire du preset ou admin
        if (req.user.role !== 'admin' && preset.user.toString() !== req.user._id.toString()) {
            return res.status(402).json({ error: 'Unauthorized' });
        }

        // Mettez à jour les propriétés nécessaires du preset avec les données de req.body
        Object.assign(preset, req.body);

        // Sauvegardez les modifications dans la base de données
        await preset.save();

        res.status(200).json(preset);
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: DELETE /presets/1 Supprimer les données d'une configuration (🔒 être connecté avec son propre compte ou admin)
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const preset = await Preset.findById(req.params.id);

        if (!preset) {
            return res.status(404).json({ 'error': 'Preset not found' });
        }

        // Vérifier si l'utilisateur est propriétaire du preset ou admin
        if (req.user.role !== 'admin' && preset.user.toString() !== req.user._id.toString()) {
            return res.status(402).json({ error: 'Unauthorized' });
        }

        await Preset.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Preset successfully deleted!' });
    } catch (e) {
        res.status(400).json(e);
    }
});


module.exports = router;
