import recoveryService from '../services/recoveryService.js';

const recoveryController = {
    // Mostrar el formulario de recuperación de contraseña
    showRecoveryForm(request, response) {
        response.render('recovery/recoveryForm');
    },

    // Enviar un correo de recuperación
    async sendRecoveryEmail(request, response) {
        const email = request.body.email;
        const result = await recoveryService.sendRecoveryEmail(email);

        if (result.error) {
            return response.render('recovery/recoveryForm', { error: result.error, emailNotRegistered: result.emailNotRegistered });
        }

        response.render('recovery/success');
    },

    // Formulario de restablecimiento de contraseña
    showResetForm(request, response) {
        const { token } = request.params;
        response.render('recovery/resetForm', { token });
    },

    // Restablecer la contraseña
    async resetPassword(request, response) {
        const { token } = request.params;
        const { newPassword, confirmNewPassword } = request.body;
        const result = await recoveryService.resetPassword(token, newPassword, confirmNewPassword);

        if (result.error) {
            return response.render('recovery/resetForm', { token, passwordInc: true, error: result.error });
        }

        response.render('recovery/changeOK');
    },
};

export default recoveryController;