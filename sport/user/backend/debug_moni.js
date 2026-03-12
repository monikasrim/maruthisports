const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const debugLogin = async () => {
    const email = 'moni@gmail.com';
    const password = '12345678';

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User matching ${email} NOT found.`);
        } else {
            console.log(`User found:`);
            console.log(`- ID: ${user._id}`);
            console.log(`- Name: ${user.name}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Role: ${user.role}`);

            const isMatch = await user.matchPassword(password);
            console.log(`- Password Match: ${isMatch}`);

            if (!isMatch) {
                // Secondary check with manual bcrypt compare just in case
                const manualMatch = await bcrypt.compare(password, user.password);
                console.log(`- Manual Bcrypt Compare: ${manualMatch}`);
            }
        }
        process.exit();
    } catch (error) {
        console.error('Debug script error:', error);
        process.exit(1);
    }
};

debugLogin();
