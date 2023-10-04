import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailConfig from '../config/emailConfig.js';
import dotenv from 'dotenv';
dotenv.config();

const recoveryService = {
     // Enviar correo electrónico de recuperación de contraseña
    async sendRecoveryEmail(email) {
        const user = await userModel.findOne({ email });

        if (!user) {
            return { error: 'El correo electrónico no está registrado', emailNotRegistered: true };
        }

        // Crear un token con el correo electrónico del usuario
        const token = jwt.sign({ email }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
        const recoveryLink = `${process.env.URL}/api/recover-password/reset/${token}`;

        // Configuración del correo electrónico
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `Haga clic en el siguiente enlace para restablecer su contraseña. <a href="${recoveryLink}">Click aquí</a>`,
        };

        // Enviar correo electrónico
        await emailConfig.transporter.sendMail(mailOptions);
        return { success: true };
    },

    // Restablecer la contraseña usando el token proporcionado y la nueva contraseña
    async resetPassword(token, newPassword, confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
            return { error: 'Las contraseñas no coinciden' };
        }

        try {
            // Verificar y decodificar el token
            const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
            const expirationTimeInSeconds = decodedToken.exp;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);

            // Verificar si el token ha expirado
            if (currentTimeInSeconds > expirationTimeInSeconds) {
                return { error: 'El token ha expirado' };
            }

            // Obtener el usuario asociado al correo electrónico del token
            const user = await userModel.findOne({ email: decodedToken.email });
            const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

            // Verificar si la nueva contraseña es diferente de la anterior
            if (isPasswordMatch) {
                return { error: 'La nueva contraseña debe ser diferente de la anterior' };
            }
            
            // Hash de la nueva contraseña y actualización en la base de datos
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userModel.updateOne({ email: decodedToken.email }, { password: hashedPassword });
            return { success: true };
        } catch (error) {
            return { error: 'El token no es válido' };
        }
    },
};

export default recoveryService;