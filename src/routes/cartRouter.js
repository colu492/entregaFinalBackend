import express from 'express';
import cartManager from '../models/cartManager.js';

const router = express.Router();

// Ruta POST /api/carts/
router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
        res.json(cart);
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; // Si no se proporciona la cantidad, se establece en 1

    const result = cartManager.addToCart(cartId, productId, quantity);

    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
});

export default router;
