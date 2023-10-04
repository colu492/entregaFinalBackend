import express from "express";
import viewsController from "../controllers/viewsController.js";

const router = express.Router();


// Ruta para renderizar la página de inicio
router.get("/", viewsController.renderIndex);
// Ruta para renderizar la página de productos en tiempo real
router.get("/realtimeProducts", viewsController.renderRealTimeProducts);
// Ruta para renderizar la lista de productos
router.get("/products", viewsController.renderProductList);
// Ruta para renderizar la página del carrito
router.get("/carts/:cid", viewsController.renderCart);

export default router;