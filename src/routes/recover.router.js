import express from 'express';
import recoveryController from '../controllers/recoveryController.js';

const router = express.Router();

// Rutas y sus controladores correspondientes

// Mostrar el formulario de recuperación
router.get('/',recoveryController.showRecoveryForm) 
// Enviar un correo electrónico de recuperación
router.post('/sendRecoveryEmail', recoveryController.sendRecoveryEmail)
// Mostrar el formulario de restablecimiento con un token
router.get('/reset/:token', recoveryController.showResetForm) 
// Restablecer la contraseña con un token
router.post('/reset/:token', recoveryController.resetPassword)
export default router