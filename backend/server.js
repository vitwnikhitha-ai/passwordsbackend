const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Password Manager API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Vercel-Admin-atlas-bisque-drawer:gyUVMvDwOD9WWNbc@atlas-bisque-drawer.bev7yzj.mongodb.net/password-manager?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
