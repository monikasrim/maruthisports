require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailIPv4() {
    console.log("Testing with hardcoded IPv4...");
    const transporter = nodemailer.createTransport({
        host: '142.251.10.108', // smtp.gmail.com IPv4
        port: 465,
        secure: true,
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
        console.log("SMTP Config is correct (IPv4)!");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email via hardcoded IPv4',
            text: 'This is a test email via IPv4'
        });
        console.log("Email sent!", info.messageId);
    } catch (err) {
        console.error("SMTP Error (IPv4): ", err.message);
    }
}

testGmailIPv4();
