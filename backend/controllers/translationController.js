const Translation = require('../models/Translation');
const String = require('../models/String');
const App = require('../models/App');

// @desc    Create/Update translation
// @route   POST /api/translations
// @access  Private
exports.createTranslation = async (req, res) => {
  try {
    const { stringId, language, value, status } = req.body;

    // Check if string exists
    const string = await String.findById(stringId);
    if (!string) {
      return res.status(404).json({ message: 'String not found' });
    }

    // Check if app exists and user has access
    const app = await App.findById(string.app);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if language is supported
    if (!app.languages.includes(language)) {
      return res.status(400).json({ message: 'Language not supported' });
    }

    // Create or update translation
    let translation = await Translation.findOne({ string: stringId, language });
    
    if (translation) {
      translation.value = value;
      translation.status = status || translation.status;
      translation.lastModifiedBy = req.user._id;
    } else {
      translation = await Translation.create({
        string: stringId,
        language,
        value,
        status: status || 'draft',
        createdBy: req.user._id,
        lastModifiedBy: req.user._id
      });
    }

    await translation.save();
    res.status(201).json(translation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get translations for a string
// @route   GET /api/translations/string/:stringId
// @access  Private
exports.getTranslations = async (req, res) => {
  try {
    const { stringId } = req.params;
    const { language, status } = req.query;

    // Check if string exists
    const string = await String.findById(stringId);
    if (!string) {
      return res.status(404).json({ message: 'String not found' });
    }

    // Check if app exists and user has access
    const app = await App.findById(string.app);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Build query
    const query = { string: stringId };
    if (language) query.language = language;
    if (status) query.status = status;

    const translations = await Translation.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('lastModifiedBy', 'firstName lastName');

    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update translation status
// @route   PUT /api/translations/:id/status
// @access  Private
exports.updateTranslationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const translation = await Translation.findById(req.params.id);

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    // Check if user has permission to update status
    const string = await String.findById(translation.string);
    if (!string) {
      return res.status(404).json({ message: 'String not found' });
    }

    const app = await App.findById(string.app);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    if (app.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    translation.status = status;
    translation.lastModifiedBy = req.user._id;
    await translation.save();

    res.json(translation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to translation
// @route   POST /api/translations/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const translation = await Translation.findById(req.params.id);

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    translation.comments.push({
      text,
      user: req.user._id
    });

    await translation.save();
    res.json(translation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 