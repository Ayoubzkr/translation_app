const express = require('express');
const router = express.Router();
const { validateApiToken } = require('../middleware/validateToken');
const String = require('../models/String');
const Translation = require('../models/Translation');

// Middleware to validate API key
router.use(validateApiToken);

// Get all translations for an app
router.get('/translations', async (req, res) => {
  try {
    const { language, status = 'approved' } = req.query;

    // Build query
    const query = { app: req.app._id, status: 'approved' };
    if (language) {
      query['translations.language'] = language;
    }

    const strings = await String.find(query)
      .select('key translations')
      .lean();

    // Format response
    const translations = strings.reduce((acc, string) => {
      const translation = string.translations.find(t => 
        t.language === language && t.status === 'approved'
      );
      if (translation) {
        acc[string.key] = translation.value;
      }
      return acc;
    }, {});

    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get translation for a specific key
router.get('/translations/:key', async (req, res) => {
  try {
    const { language } = req.query;
    const { key } = req.params;

    const string = await String.findOne({
      app: req.app._id,
      key,
      status: 'approved'
    }).lean();

    if (!string) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    const translation = string.translations.find(t => 
      t.language === language && t.status === 'approved'
    );

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found for this language' });
    }

    res.json({ [key]: translation.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 