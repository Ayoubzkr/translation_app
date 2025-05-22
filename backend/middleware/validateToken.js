const App = require('../models/App');

exports.validateApiToken = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ message: 'API key is required' });
    }

    const app = await App.findOne({ apiKey, isActive: true });
    
    if (!app) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    req.app = app;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error validating API key' });
  }
}; 