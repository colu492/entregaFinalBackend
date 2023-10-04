import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import { authorizePremiumAdmin, authorizeAdmin } from '../services/authMiddleware.js';


const router = Router();

// Rutas y sus controladores correspondientes

// Obtener todos los productos
router.get('/', ProductController.GetAll);
// Crear productos de prueba (mock)
router.get('/mockingproducts', ProductController.MockProduct);
// Obtener un producto por su ID
router.get('/:pid', ProductController.GetByID);
// Crear un nuevo producto (requiere autorización de usuario premium o admin)
router.post('/', authorizePremiumAdmin, ProductController.CreateProduct);
// Actualizar la información de un producto (requiere autorización de admin)
router.put('/:pid', authorizeAdmin, ProductController.UpdateProduct);
// Eliminar un producto (requiere autorización de usuario premium o admin)
router.delete('/:pid',authorizePremiumAdmin, ProductController.DeleteProduct);

export default router;