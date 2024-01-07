var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Preset = require('../models/Preset');

// TODO: GET /users Récupérer tous les utilisateurs (⚙️ filtre de recherche partielle sur le username)
router.get('/', async (req, res) => {
    try {
        let { username } = req.query;
        let filters = {};

        if (username) {
            filters.username = { $regex: new RegExp(username, 'i') };
        }

        const users = await User.find(filters);
        res.json({ users });
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: GET /users/1 Récupérer les données d'un utilisateur avec la liste de ses presets
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ 'error': 'User not found' });
        }

        const presets = await Preset.find({ user: user._id });

        res.json({ user, presets });
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: PATCH /users/1 Modifier les données d'un utilisateur (🔒 être connecté + uniquement sur son compte sauf si admin)
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ 'error': 'User not found' });
        }

        // Vérifier si l'utilisateur est propriétaire du compte ou admin
        if (req.user.role !== 'admin' && user._id.toString() !== req.user._id.toString()) {
            return res.status(402).json({ error: 'Unauthorized' });
        }

        // Mettez à jour les propriétés nécessaires de l'utilisateur avec les données de req.body
        Object.assign(user, req.body);

        // Sauvegardez les modifications dans la base de données
        await user.save();

        res.status(200).json(user);
    } catch (e) {
        res.status(400).json(e);
    }
});

// TODO: DELETE /users/1 Supprimer les données d'un utilisateur (🔒 être connecté + uniquement sur son compte sauf si admin)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ 'error': 'User not found' });
        }

        // Vérifier si l'utilisateur est propriétaire du compte ou admin
        if (req.user.role !== 'admin' && user._id.toString() !== req.user._id.toString()) {
            return res.status(402).json({ error: 'Unauthorized' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'User successfully deleted!' });
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports = router;
