const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const setupAdmin = async () => {
    try {
        await connectDB();
        
        const email = 'ishu@gmail.com';
        const password = '12345678';
        
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} found. Updating password and ensuring admin role...`);
            user.password = password;
            user.role = 'admin';
            await user.save();
            console.log('User updated successfully.');
        } else {
            console.log(`User ${email} not found. Creating new admin user...`);
            await User.create({
                name: 'Ishu Admin',
                email,
                password,
                role: 'admin'
            });
            console.log('User created successfully.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error setting up admin:', err);
        process.exit(1);
    }
};

setupAdmin();
