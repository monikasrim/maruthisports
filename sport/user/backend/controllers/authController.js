const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    email = email.trim().toLowerCase();

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user', // Default to user if not provided
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.image = req.body.image || user.image;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.city = req.body.city !== undefined ? req.body.city : user.city;
        user.state = req.body.state !== undefined ? req.body.state : user.state;
        user.postalCode = req.body.postalCode !== undefined ? req.body.postalCode : user.postalCode;
        user.country = req.body.country !== undefined ? req.body.country : user.country;
        user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            image: updatedUser.image,
            address: updatedUser.address,
            city: updatedUser.city,
            state: updatedUser.state,
            postalCode: updatedUser.postalCode,
            country: updatedUser.country,
            phoneNumber: updatedUser.phoneNumber,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Send OTP to email
// @route   POST /api/users/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
    let { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide an email');
    }

    email = email.trim().toLowerCase(); // Ensure consistency

    let user = await User.findOne({ email });

    if (!user) {
        console.log(`Creating new user for OTP: ${email}`);
        // Auto-create user if they don't exist to allow any email for OTP
        user = await User.create({
            name: email.split('@')[0], // Use email prefix as name
            email,
            password: Math.random().toString(36).slice(-10), // Random dummy password
            role: 'user',
        });
    } else {
        console.log(`Generating OTP for existing user: ${email}`);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    const message = `Your Maruthi Sports login OTP is: ${otp}. It will expire in 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Login OTP - Maruthi Sports',
            message,
        });

        res.status(200).json({ success: true, message: 'OTP sent to your Gmail inbox' });
    } catch (error) {
        console.error('--- OTP DELIVERY FAILURE ---');
        console.error(`Target Email: ${user.email}`);
        console.error(`OTP (to help you login while debugging): ${otp}`);
        console.error('SMTP Error:', error.message);

        if (process.env.EMAIL_USER === 'YOUR_GMAIL@gmail.com') {
            console.warn('WARNING: You have not configured your Gmail credentials in .env');
        }
        console.error('----------------------------');

        // Return success status even if email fails, to allow login with debug OTP (useful for firewall-blocked environments)
        res.status(200).json({
            success: true,
            message: `SMTP block detected. OTP generated for debugging: ${otp}. Please enter it to continue.`
        });
    }
});

// @desc    Verify OTP and log in
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        token: generateToken(user._id),
    });
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    sendOTP,
    verifyOTP,
};
