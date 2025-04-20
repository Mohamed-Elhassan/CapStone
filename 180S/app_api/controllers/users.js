const mongoose = require('mongoose');
const User = require('../models/user');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    console.log('Current user:', req.user); // Debug log
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can view users' });
    }

    // Get all users, excluding sensitive data
    const users = await User.find({}, 'name email isAdmin');
    console.log('Found users:', users); // Debug log
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error); // Debug log
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Toggle admin status (admin only)
exports.toggleAdminStatus = async (req, res) => {
  try {
    console.log('Toggle admin - Current user:', req.user); // Debug log
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can modify admin status' });
    }

    const { userId } = req.params;
    const { isAdmin } = req.body;

    // Prevent modifying own admin status
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot modify your own admin status' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true, select: 'name email isAdmin' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in toggleAdminStatus:', error); // Debug log
    res.status(500).json({ message: 'Error updating admin status', error: error.message });
  }
}; 