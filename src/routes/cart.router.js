import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import { authorizeUserPremium } from '../services/authMiddleware.js';


const router = Router();

// Rutas y sus controladores correspondientes

// Crear un carrito de compras
router.post('/', cartController.CreateCart);
// Obtener información de un carrito de compras por ID
router.get('/:cid', cartController.GetCart);
// Añadir un producto al carrito de compras (requiere autorización de usuario premium)
router.post('/:cid/products/:pid', authorizeUserPremium, cartController.AddProductToCart);
// Eliminar un producto del carrito de compras
router.delete('/:cid/products/:pid', cartController.DeleteProductToCart);
// Actualizar la información general del carrito de compras
router.put('/:cid', cartController.UpdateCart);
// Actualizar la cantidad de un producto en el carrito de compras
router.put('/:cid/products/:pid', cartController.UpdateQuantity) 
// Vaciar completamente el carrito de compras
router.delete('/:cid', cartController.EmptyCart)
// Realizar la compra de los productos en el carrito
router.post('/:cid/purchase', cartController.PurchaseCart);

export default router;