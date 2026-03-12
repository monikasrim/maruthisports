require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmail() {
    console.log("Testing with IPv4...");
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        lookup: (hostname, options, callback) => {
            require('dns').lookup(hostname, { family: 4 }, (err, address, family) => {
                callback(err, address, family);
            });
        }
    });

    try {
        await transporter.verify();
        console.log("SMTP Config is correct (465)!");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'This is a test email via IPv4'
        });
        console.log("Email sent!", info.messageId);
    } catch (err) {
        console.error("SMTP Error (465): ", err.message);
    }
}

testGmail();
