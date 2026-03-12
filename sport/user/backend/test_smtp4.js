require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailIPv4_587() {
    console.log("Testing with hardcoded IPv4 on port 587...");
    const transporter = nodemailer.createTransport({
        host: '142.251.10.108', // smtp.gmail.com IPv4
        port: 587,
        secure: false, // TLS upgrades later
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            servername: 'smtp.gmail.com',
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.verify();
        console.log("SMTP Config is correct (IPv4 587)!");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email via hardcoded IPv4 587',
            text: 'This is a test email via IPv4'
        });
        console.log("Email sent!", info.messageId);
    } catch (err) {
        console.error("SMTP Error (IPv4 587): ", err);
    }
}

testGmailIPv4_587();
