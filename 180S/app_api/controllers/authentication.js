const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name: req.body.name, email: req.body.email });
    user.setPassword(req.body.password);
    await user.save();
    res.status(200).json({ token: user.generateJwt() });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.validPassword(req.body.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ 
      token: user.generateJwt(), 
      user: { 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const status = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(200).json({ loggedIn: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(200).json({ loggedIn: false });
    }

    res.status(200).json({ 
      loggedIn: true,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(200).json({ loggedIn: false });
  }
};

module.exports = {
  register,
  login,
  status
};
