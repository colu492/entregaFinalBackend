import express from 'express';
import productManager from '../models/productManager.js';

const router = express.Router();

// Ruta GET /api/products/
router.get('/', (req, res) => {
    const products = productManager.getAllProducts();
    res.json(products);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const product = productManager.getProductById(productId);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        res.json(product);
    }
});

// Ruta POST /api/products/
router.post('/', (req, res) => {
    const newProduct = req.body;
    const createdProduct = productManager.addProduct(newProduct);
    res.status(201).json(createdProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const result = productManager.updateProduct(productId, updatedProduct);
    if (result) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const result = productManager.deleteProduct(productId);
    if (result) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

export default router;
