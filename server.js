const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// POST route to handle sending emails
app.post('/send-email', async (req, res) => {
    try {
        const { email, phoneNumber, cartItems } = req.body;

        // Create a transporter object using SMTP server settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // TLS
            auth: {
                user: 'logisticpositivesmtp@hotmail.com',
                pass: 'l(J8\\)BR29_]' // Replace with your Outlook email password
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        // Construct email message
        const mailOptions = {
            from: 'logisticpositivesmtp@hotmail.com',
            to: 'samuel.sladky@gmail.com', // Your email address
            subject: 'New Order', // Subject for the email
            html: `
                <p>Email: ${email}</p>
                <p>Phone Number: ${phoneNumber}</p>
                <p>Cart Items:</p>
                <ul>
                    ${cartItems.map(item => `<li>${item.title} - ${item.price} x ${item.quantity}</li>`).join('')}
                </ul>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
