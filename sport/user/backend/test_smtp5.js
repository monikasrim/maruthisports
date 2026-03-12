require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmail443() {
    console.log("Testing SMTP on port 443...");
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // smtp.gmail.com IPv4
        port: 443,
        secure: true, // TLS upgrades later
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.verify();
        console.log("SMTP Config is correct (443)!");
    } catch (err) {
        console.error("SMTP Error (443): ", err);
    }
}

testGmail443();
