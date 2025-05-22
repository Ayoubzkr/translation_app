const String = require('../models/String');
const App = require('../models/App');

// @desc    Create new string
// @route   POST /api/strings
// @access  Private
exports.createString = async (req, res) => {
  try {
    const { key, appId, context, tags } = req.body;

    // Check if app exists and user has access
    const app = await App.findById(appId);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const string = await String.create({
      key,
      app: appId,
      context,
      tags,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    });

    res.status(201).json(string);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all strings for an app
// @route   GET /api/strings/app/:appId
// @access  Private
exports.getStrings = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status, language, search } = req.query;

    // Check if app exists and user has access
    const app = await App.findById(appId);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Build query
    const query = { app: appId };
    if (status) query.status = status;
    if (language) query['translations.language'] = language;
    if (search) {
      query.$or = [
        { key: { $regex: search, $options: 'i' } },
        { context: { $regex: search, $options: 'i' } }
      ];
    }

    const strings = await String.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('lastModifiedBy', 'firstName lastName');

    res.json(strings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update string status
// @route   PUT /api/strings/:id/status
// @access  Private
exports.updateStringStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const string = await String.findById(req.params.id);

    if (!string) {
      return res.status(404).json({ message: 'String not found' });
    }

    // Check if user has permission to update status
    const app = await App.findById(string.app);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    string.status = status;
    string.lastModifiedBy = req.user._id;
    await string.save();

    res.json(string);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete string
// @route   DELETE /api/strings/:id
// @access  Private
exports.deleteString = async (req, res) => {
  try {
    const string = await String.findById(req.params.id);

    if (!string) {
      return res.status(404).json({ message: 'String not found' });
    }

    // Check if user has permission to delete
    const app = await App.findById(string.app);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await string.remove();
    res.json({ message: 'String removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 