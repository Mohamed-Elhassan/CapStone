const mongoose = require('mongoose');
const User = require('../app_api/models/user');
require('dotenv').config();

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email: 'admin@180s.com',
      name: 'Admin User',
      isAdmin: true
    });

    // Set password (you'll be prompted to enter it)
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Enter password for admin user: ', async (password) => {
      admin.setPassword(password);
      await admin.save();
      console.log('Admin user created successfully!');
      readline.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin(); 