const App = require('../models/App');

// @desc    Create new app
// @route   POST /api/apps
// @access  Private
exports.createApp = async (req, res) => {
  try {
    const { name, description, languages, defaultLanguage, settings } = req.body;

    const app = await App.create({
      name,
      description,
      owner: req.user._id,
      languages,
      defaultLanguage,
      settings
    });

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all apps
// @route   GET /api/apps
// @access  Private
exports.getApps = async (req, res) => {
  try {
    const apps = await App.find({ owner: req.user._id });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single app
// @route   GET /api/apps/:id
// @access  Private
exports.getApp = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    // Check if user is owner
    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update app
// @route   PUT /api/apps/:id
// @access  Private
exports.updateApp = async (req, res) => {
  try {
    const { name, description, languages, defaultLanguage, settings } = req.body;

    const app = await App.findById(req.params.id);
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    // Check if user is owner
    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    app.name = name || app.name;
    app.description = description || app.description;
    app.languages = languages || app.languages;
    app.defaultLanguage = defaultLanguage || app.defaultLanguage;
    app.settings = { ...app.settings, ...settings };

    const updatedApp = await app.save();
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete app
// @route   DELETE /api/apps/:id
// @access  Private
exports.deleteApp = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    // Check if user is owner
    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await app.remove();
    res.json({ message: 'App removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 