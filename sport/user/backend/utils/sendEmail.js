const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Maruthi Sports'} <${process.env.FROM_EMAIL || 'noreply@maruthisports.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Support HTML emails
    };

    const info = await transporter.sendMail(message);
    return info;
};

module.exports = sendEmail;
