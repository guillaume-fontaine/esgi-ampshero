const express = require('express');
const passport = require("passport");
const Preset = require("../models/Preset");
const router = express.Router();

// TODO: GET /presets Retourner la liste des configurations (🔗 avec les données de l'utilisateur et l'ampli ⚙️ filtre par ampli + recherche partielle sur titre de musique)

// TODO: POST /presets Créer une nouvelle configuration (🔒 être connecté)

// TODO: GET /presets/1 Récupérer les données d'une configuration (🔗 avec les données de l'utilisateur et l'ampli)

// TODO: PATCH /presets/1 Modifier les données d'une configuration (🔒 être connecté avec son propre compte ou admin)

// TODO: DELETE /presets/1 Supprimer les données d'une configuration (🔒 être connecté avec son propre compte ou admin)


module.exports = router;
