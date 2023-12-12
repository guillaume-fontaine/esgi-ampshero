var express = require('express');
var router = express.Router();
const User = require('../models/User');

// TODO: GET /users Récupérer tous les utilisateurs (⚙️ filtre de recherche partielle sur le username)

// TODO: GET /users/1 Récupérer les données d'un utilisateur avec la liste de ses presets

// TODO: PATCH /users/1 Modifier les données d'un utilisateur (🔒 être connecté + uniquement sur son compte sauf si admin)

// TODO: DELETE /users/1 Supprimer les données d'un utilisateur (🔒 être connecté + uniquement sur son compte sauf si admin)

module.exports = router;
