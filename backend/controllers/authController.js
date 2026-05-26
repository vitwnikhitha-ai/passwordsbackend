const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

// @route   POST api/auth/google
// @desc    Authenticate with Google
// @access  Public
exports.googleAuth = async (req, res) => {
  const { email, username, googleId } = req.body;
  
  try {
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user if they don't exist
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + 'A1!';
      user = new User({
        username: username || email.split('@')[0],
        email,
        password: generatedPassword
      });
      await user.save();
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};
