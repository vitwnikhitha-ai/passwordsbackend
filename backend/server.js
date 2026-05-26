const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Documentation
const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'
};
app.use('/api-docs', (req, res, next) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const dynamicSwagger = JSON.parse(JSON.stringify(swaggerDocument));
  dynamicSwagger.servers = [
    {
      url: `${protocol}://${host}`,
      description: 'Current Environment'
    },
    ...swaggerDocument.servers.filter(s => !s.url.includes(host))
  ];
  req.swaggerDoc = dynamicSwagger;
  next();
}, swaggerUi.serve, (req, res) => {
  swaggerUi.setup(req.swaggerDoc, swaggerOptions)(req, res);
});

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
