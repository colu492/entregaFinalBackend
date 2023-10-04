import nodemailer from 'nodemailer';
import mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

// Configuracion nodemailer para Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Configuración mailgen para generar
const sharedMailgenConfig = {
    theme: 'default',
    product: {
        name: 'Coder SHOP',
        link: 'http://www.coderhouse.com',
    },
};

// Instancia de mailgen
const mailGenerator = new mailgen(sharedMailgenConfig);

export default { transporter, mailGenerator };