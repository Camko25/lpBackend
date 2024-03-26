const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// POST route to handle sending emails and checkout
app.post('/send-mail', async (req, res) => {
    try {
        const { name, email, phoneNumber, shippingAddress, zipCode, billingAddress, cartItems } = req.body;

        // Send order confirmation to user
        await sendOrderConfirmationToUser(name, email, cartItems);

        // Send order details to main email address
        await sendOrderDetailsToMainEmail(name, email, phoneNumber, shippingAddress, zipCode, billingAddress, cartItems);

        console.log('Checkout process completed successfully');
        res.status(200).send('Checkout process completed successfully');
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).send('Error processing checkout');
    }
});

// Function to send order confirmation to user
async function sendOrderConfirmationToUser(name, userEmail, cartItems) {
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

    // Construct email message with order confirmation details for the user
    const userMailOptions = {
        from: 'logisticpositivesmtp@hotmail.com',
        to: userEmail,
        subject: 'Potvrdenie Objednávky',
        html: `
            <h2>Potvrdenie Objednávky</h2>
            <p>Dobrý deň ${name},</p>
            <p>Vaša objednávka bola úspešne zaevidovaná!</p>
            <p><strong>Objednané produkty:</strong></p>
            <ul>
                ${cartItems.map(item => `<li>${item.title} - ${item.price}€ x ${item.quantity}</li>`).join('')}
            </ul>
            <p><strong>Spolu:</strong> ${calculateTotal(cartItems)}€</p>
            <p><strong>Predpokladaná doba doručenia:</strong> 72 hodín</p>
        `
    };

    // Send email to the user
    await transporter.sendMail(userMailOptions);
    console.log('Order confirmation sent to user successfully');
}

// Function to send order details to main email address
async function sendOrderDetailsToMainEmail(name, userEmail, phoneNumber, shippingAddress, zipCode, billingAddress, cartItems) {
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

    // Construct email message with order details for the main email address
    const mainMailOptions = {
        from: 'logisticpositivesmtp@hotmail.com',
        to: 'samuel.sladky@gmail.com', // Your main email address
        subject: 'Detail objednávky',
        html: `
            <h2>Detail objednávky</h2>
            <p><strong>Meno zákazníka:</strong> ${name}</p>
            <p><strong>Email zákazníka:</strong> ${userEmail}</p>
            <p><strong>Tel. číslo zákazníka:</strong> ${phoneNumber}</p>
            <p><strong>Doručovacia adresa:</strong> ${shippingAddress}, ${zipCode}</p>
            <p><strong>Fakturačná adresa:</strong> ${billingAddress}</p>
            <p><strong>Objednané produkty:</strong></p>
            <ul>
                ${cartItems.map(item => `<li>${item.title} - ${item.price}€ x ${item.quantity}</li>`).join('')}
            </ul>
        `
    };

    // Send email to the main email address
    await transporter.sendMail(mainMailOptions);
    console.log('Order details sent to main email address successfully');
}

// Function to calculate total price of items
function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
