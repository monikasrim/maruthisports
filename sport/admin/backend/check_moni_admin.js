const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');
const fs = require('fs');

dotenv.config();
connectDB();

const debug = async () => {
    try {
        const user = await User.findOne({ email: 'moni@gmail.com' });
        const result = {
            found: !!user,
            user: user ? {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hasPassword: !!user.password
            } : null
        };

        if (user) {
            result.passwordMatch = await user.matchPassword('12345678');
        }

        fs.writeFileSync('d:/MCA_FINAL PROJECT/sport/admin/backend/debug_moni_admin.json', JSON.stringify(result, null, 2));
        console.log('Result written to debug_moni_admin.json');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
