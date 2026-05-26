const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // Check if user exists
    let user = await User.findOne({ email: 'test1@test.com' });
    console.log('User found:', user);

    if (!user) {
        user = new User({
            username: 'test1',
            email: 'test1@test.com',
            password: 'password123'
        });
        await user.save();
        console.log('User saved successfully');
    }
  } catch (err) {
    console.error('ERROR ENCOUNTERED:', err.message);
    console.error(err);
  } finally {
    process.exit();
  }
}

test();
