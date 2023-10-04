import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { upload } from "../services/multerMiddleware.js";
import { authorizeAdmin } from "../services/authMiddleware.js"


const router = Router();


// Ruta para mostrar el formulario de documentos de usuarios premium
router.get('/premium/:uid', UsersController.formDocs);
// Ruta para enviar documentos de usuario
router.post('/:uid/documents', upload.fields([{name:'profileImage'}, {name:'productImage'}, {name:'identificacion'}, {name:'domicilio'}, {name:'compruebaCuenta'}]), UsersController.envDocs);
// Ruta para cambiar el rol de un usuario a premium
router.put('/premium/:uid', UsersController.changeRole);
// Ruta para obtener la lista de usuarios solo admin
router.get('/', authorizeAdmin, UsersController.usersList );
// Ruta para eliminar usuarios inactivos
router.delete('/', UsersController.deleteIna)
// Ruta para cambiar manualmente el rol de un usuario solo admin
router.post('/manualChangeRole/:userId', authorizeAdmin, UsersController.manualChangeRole);
// Ruta para eliminar manualmente a un usuario solo admin
router.delete('/manualDeleteUser/:userId', authorizeAdmin, UsersController.manualDeleteUser)

export default router