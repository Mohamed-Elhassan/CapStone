const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = async (req, res) => {
  // Check for required fields
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Create and populate a new User instance
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    // Save the user (no callback)
    await user.save();

    // Generate and return a JWT
    const token = user.generateJwt();
    return res.status(200).json({ token });
  } catch (err) {
    // Return any validation or DB errors
    return res.status(400).json(err);
  }
};

const login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    const token = user.generateJwt();
    return res.status(200).json({ token });
  })(req, res, next);
};

module.exports = { register, login };
