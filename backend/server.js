const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

process.env.JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_for_development';

const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Documentation
app.get('/api-docs/swagger.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'swagger.json'));
});
app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'swagger.html'));
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Password Manager API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Vercel-Admin-atlas-bisque-drawer:gyUVMvDwOD9WWNbc@atlas-bisque-drawer.bev7yzj.mongodb.net/password-manager?retryWrites=true&w=majority';

mongoose.set('bufferCommands', false);

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
