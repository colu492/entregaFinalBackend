import CartManager from "../dao/cartManager.js";

// Instancia de CartManager
const cartManager = new CartManager();

class CartService {
    // Crear un nuevo carrito
    async createCart() {
        try {
            return await cartManager.createCart();
        } catch (error) {
            throw new Error("Error al crear el carrito" + error.message);
        }
    }

    // Obtener un carrito por su ID
    async getCartById(id) {
        try {
            return await cartManager.getCartById(id);
        } catch (error) {
            throw new Error("Error al obtener el carrito" + error.message);
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cid, pid) {
        try {
            return await cartManager.addProductToCart(cid, pid);
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito" + error.message);
        }
    }

    // Eliminar un producto de un carrito
    async deleteProductToCart(cid, pid) {
        try {
            return await cartManager.deleteProductToCart(cid, pid);
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito" + error.message);
        }
    }

    // Actualizar la información de un carrito
    async updateCart(cid, products) {
        try {
            return await cartManager.updateCart(cid, products);
        } catch (error) {
            throw new Error("Error al actualizar el carrito" + error.message);
        }
    }

    // Actualizar la cantidad de un producto en un carrito
    async updateQuantity(cid, pid, quantity) {
        try {
            return await cartManager.updateQuantity(cid, pid, quantity);
        } catch (error) {
            throw new Error("Cantidad error" + error.message);
        }
    }

    // Vaciar un carrito
    async emptyCart(cid) {
        try {
            return await cartManager.emptyCart(cid);
        } catch (error) {
            throw new Error("Error al vaciar el carrito" + error.message);
        }
    }

    // Realizar la compra de un carrito
    async purchaseCart(cid, purchaserEmail) {
        try {
            return await cartManager.purchaseCart(cid, purchaserEmail);
        } catch (error) {
            throw new Error("Error al realizar la compra" + error.message);
        }
    }

}


export default CartService;