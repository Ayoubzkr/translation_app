const User = require('../models/User');
const App = require('../models/App');
const String = require('../models/String');
const Translation = require('../models/Translation');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalApps = await App.countDocuments();
    const totalStrings = await String.countDocuments();
    const totalTranslations = await Translation.countDocuments();

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent apps
    const recentApps = await App.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalApps,
      totalStrings,
      totalTranslations,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentUsers,
      recentApps
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      message: 'Error fetching admin stats',
      error: error.message 
    });
  }
}; 