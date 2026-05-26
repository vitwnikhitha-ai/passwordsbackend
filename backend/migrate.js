const mongoose = require('mongoose');
const User = require('./models/User');
const Password = require('./models/Password');
require('dotenv').config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/password-manager';
const REMOTE_URI = 'mongodb+srv://Vercel-Admin-atlas-bisque-drawer:gyUVMvDwOD9WWNbc@atlas-bisque-drawer.bev7yzj.mongodb.net/password-manager?retryWrites=true&w=majority';

async function migrate() {
  let users = [];
  let passwords = [];

  try {
    // 1. Connect to Local MongoDB
    console.log('Connecting to LOCAL database...');
    await mongoose.connect(LOCAL_URI);
    console.log('Connected! Fetching local data...');

    users = await User.find({}).lean();
    passwords = await Password.find({}).lean();

    console.log(`Found ${users.length} users and ${passwords.length} password entries locally.`);
    await mongoose.disconnect();
    console.log('Disconnected from LOCAL database.');

    if (users.length === 0 && passwords.length === 0) {
      console.log('No data found to migrate.');
      return;
    }

    // 2. Connect to Remote MongoDB Atlas
    console.log('\nConnecting to REMOTE MongoDB Atlas database...');
    await mongoose.connect(REMOTE_URI);
    console.log('Connected to Remote Database! Beginning migration...');

    let migratedUsersCount = 0;
    let migratedPasswordsCount = 0;

    // Migrate Users (using collection.insertOne to bypass Mongoose pre-save hashing)
    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        // Use collection directly to preserve the _id and avoid re-hashing the password
        await User.collection.insertOne(user);
        console.log(`Migrated User: ${user.username} (${user.email})`);
        migratedUsersCount++;
      } else {
        console.log(`User already exists on remote, skipping: ${user.email}`);
      }
    }

    // Migrate Passwords
    for (const pwd of passwords) {
      const exists = await Password.findOne({ _id: pwd._id });
      if (!exists) {
        await Password.collection.insertOne(pwd);
        console.log(`Migrated Password Entry: ${pwd.website} for ${pwd.email}`);
        migratedPasswordsCount++;
      } else {
        console.log(`Password entry already exists on remote, skipping: ${pwd.website} (${pwd._id})`);
      }
    }

    console.log('\n======================================');
    console.log('MIGRATION SUMMARY:');
    console.log(`- Users Migrated: ${migratedUsersCount}/${users.length}`);
    console.log(`- Password Entries Migrated: ${migratedPasswordsCount}/${passwords.length}`);
    console.log('======================================');

  } catch (err) {
    console.error('Migration failed with error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Database connections closed.');
    process.exit(0);
  }
}

migrate();
