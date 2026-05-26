const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  website: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String, // In a real-world scenario, you might want to encrypt this field additionally before storing in DB.
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  }
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);
