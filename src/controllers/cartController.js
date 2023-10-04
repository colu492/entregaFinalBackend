import CartService from "../services/cartService.js"
import logger from "../services/logger.js";

// Instancia del carrito
const cartService = new CartService();

// Objeto para manejar operaciones del carrito
const cartController = {

    // Creando carrito
    async CreateCart(request, response) {
        try {
            const newCart = await cartService.createCart();
            response.status(201).json({ message: 'Carrito creado con éxito!', cart: newCart })
        } catch (error) {
            logger.error('Error al crear el carrito:', error);
            response.status(500).json({ error: "Error al crear el carrito" });
        }
    },

    // Método para obtener carrito por el ID
    async GetCart(request, response) {
        const cid = request.params.cid;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                logger.warning(`No se encuentra el carrito con el id ${cid}`);
                return response.status(404).json({ message: `No se encuentra el carrito con el id ${cid}` })
            }
            response.status(200).json(cart);
        } catch (error) {
            logger.error('Error al obtener el carrito:', error);
            response.status(500).json({ message: 'error al obtener el carrito ' })
        }

    },

    // Agregar un producto al carrito
    async AddProductToCart(request, response) {
        const { cid, pid } = request.params;
        try {
            const cart = await cartService.addProductToCart(cid, pid);
            if (cart.error) {
                response.status(404).json(cart);
            } else {
                response.status(201).json({ message: 'Producto agregado con éxito' });
            }
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            response.status(500).json({ message: 'Error al agregar producto al carrito' });
        }
    },

    // Eliminar un producto del carrito
    async DeleteProductToCart(request, response) {
        const { cid, pid } = request.params;
        try {
            const cart = await cartService.deleteProductToCart(cid, pid);
            if (cart.error) {
                response.status(404).json(cart);
            } else {
                response.status(201).json({ message: 'El producto se elimino con éxito del carrito ', cart })
            }
        } catch (error) {
            logger.error('Error al eliminar producto del carrito:', error);
            response.status(500).json({ message: 'Error al eliminar el producto del carrito' })
        }
    },

    // Actualizando el carrito
    async UpdateCart(request, response) {
        try {
            const cid = request.params.cid;
            const products = request.body.products;

            const result = await cartService.updateCart(cid, products);

            if (result.error) {
                return response.status(404).json({ error: true, message: result.message });
            }

            return response.status(200).json(result);
        } catch (error) {
            logger.error('Error al actualizar el carrito:', error);
            return response.status(500).json({ message: 'Error al actualizar el carrito' });
        }
    },

    // Actualizando la cantidad de un producto en el carrito
    async UpdateQuantity(request, response) {
        try {
            const { cid, pid } = request.params;
            const quantity = request.body.quantity;

            const result = await cartService.updateQuantity(cid, pid, quantity);

            if (result.error) {
                return response.status(404).json({ message: result.message });
            }

            return response.status(200).json(result);
        } catch (error) {
            logger.error('Error al actualizar la cantidad del producto en el carrito:', error);
            return response.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito' });
        }
    },

    // Vaciar el carrito
    async EmptyCart(request, response) {
        try {
            const cid = request.params.cid;

            const emptyCart = await cartService.emptyCart(cid);

            if (emptyCart.error) {
                return response.status(404).json({ message: "El carrito con el ID indicado no existe." })
            }

            return response.status(200).json(emptyCart);
        } catch (error) {
            logger.error('Error al vaciar el carrito:', error);
            return response.status(500).json({ message: "Error al vaciar el carrito" })
        }
    },

    // Realizar compra
    async PurchaseCart(request, response) {
        const cid = request.params.cid;
        const purchaserEmail = request.session.user.email;
        console.log(purchaserEmail)
        try {
            const purchaseResult = await cartService.purchaseCart(cid, purchaserEmail);
            if (purchaseResult.error) {
                return response.status(400).json(purchaseResult);
            }

            return response.status(200).json({ message: "Compra realizada con éxito", ticket: purchaseResult.ticket });
        } catch (error) {
            logger.error('Error al realizar la compra:', error);
            return response.status(500).json({ message: "Error al realizar la compra" });
        }
    }
};


export default cartController; 