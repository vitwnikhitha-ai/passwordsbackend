const Password = require('../models/Password');

// @route   GET api/passwords
// @desc    Get all user's passwords
// @access  Private
exports.getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(passwords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/passwords
// @desc    Add new password
// @access  Private
exports.addPassword = async (req, res) => {
  const { website, email, password, category } = req.body;

  try {
    const newPassword = new Password({
      userId: req.user.id,
      website,
      email,
      password,
      category
    });

    const savedPassword = await newPassword.save();
    res.json(savedPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/passwords/:id
// @desc    Update password
// @access  Private
exports.updatePassword = async (req, res) => {
  const { website, email, password, category } = req.body;

  try {
    let pwd = await Password.findById(req.params.id);

    if (!pwd) return res.status(404).json({ message: 'Password entry not found' });

    // Make sure user owns the password entry
    if (pwd.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedFields = {};
    if (website) updatedFields.website = website;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;
    if (category) updatedFields.category = category;

    pwd = await Password.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(pwd);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/passwords/:id
// @desc    Delete password
// @access  Private
exports.deletePassword = async (req, res) => {
  try {
    let pwd = await Password.findById(req.params.id);

    if (!pwd) return res.status(404).json({ message: 'Password entry not found' });

    // Make sure user owns the password entry
    if (pwd.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Password.findByIdAndDelete(req.params.id);

    res.json({ message: 'Password entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
