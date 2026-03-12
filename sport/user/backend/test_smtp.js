require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass:", process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for port 465
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
        console.log("SMTP Config is correct");
    } catch (err) {
        console.error("SMTP Error: ", err);
    }
}

test();
