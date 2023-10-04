import { Router } from "express";
import sessionController from "../controllers/sessionController.js";


const router = Router();

// Rutas y sus controladores correspondientes


// Registro de usuario - página de registro
router.get('/register', sessionController.register);
// Registro de usuario - manejo de la solicitud de registro
router.post('/register', sessionController.postRegister);
// Página de fallo de registro
router.get('/failureRegister', sessionController.failureRegister);
// Inicio de sesión - página de inicio de sesión
router.get('/login', sessionController.login);
// Inicio de sesión - manejo de la solicitud de inicio de sesión
router.post('/login', sessionController.postLogin);
// Página de fallo de inicio de sesión
router.get('/failLogin', sessionController.failLogin);
// Cierre de sesión
router.get('/logout', sessionController.logout);
// Autenticación con GitHub - inicio de sesión con GitHub
router.get('/github', sessionController.github);
// Autenticación con GitHub - callback después de iniciar sesión con GitHub
router.get('/githubcallback', sessionController.githubCallback);
// Obtener la información del usuario actual
router.get('/current', sessionController.current);

export default router;