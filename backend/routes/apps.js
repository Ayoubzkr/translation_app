const express = require('express');
const router = express.Router();
const App = require('../models/App');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Générer un token unique
const generateToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Créer une nouvelle application
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const token = generateToken();
    
    const app = new App({
      name,
      token,
      owner: req.user._id
    });

    await app.save();
    res.status(201).json(app);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Récupérer toutes les applications de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const apps = await App.find({ owner: req.user._id });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer une application spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const app = await App.findOne({ _id: req.params.id, owner: req.user._id });
    if (!app) {
      return res.status(404).json({ message: 'Application non trouvée' });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer une application
router.delete('/:id', auth, async (req, res) => {
  try {
    const app = await App.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!app) {
      return res.status(404).json({ message: 'Application non trouvée' });
    }
    res.json({ message: 'Application supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 