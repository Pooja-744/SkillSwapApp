// controllers/userController.js — User profile management
const User = require('../models/User');

// ─── @route  GET /api/users/profile ──────────────────────────────────────────
// ─── @access Private
const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

// ─── @route  PUT /api/users/profile ──────────────────────────────────────────
// ─── @access Private
const updateProfile = async (req, res) => {
  const { name, bio, profileImage } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.profileImage = profileImage || user.profileImage;

    // If password is being updated
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password; // pre-save hook will hash it
    }

    const updated = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        bio: updated.bio,
        profileImage: updated.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };