import cartModel from '../models/carts.model.js';
import ticketModel from '../models/ticket.model.js';
import CartRepository from '../services/cartRepository.js';
import emailConfig from '../config/emailConfig.js'


export default class CartManager extends CartRepository {
    // Obtener un carrito por su ID
    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product');
            return cart;
        } catch (error) {
            console.error("Error getting cart by ID:", error);
            throw error;
        }
    }

    // Crear un nuevo carrito
    async createCart() {
        try {
            const newCart = await cartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error("Error creating cart:", error);
            throw error;
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { message: 'El carrito no existe' };
            }
            const productIndex = cart.products.findIndex(item => {
                return item.product && item.product.equals(productId);
            })
            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error agregando el producto al carrito", error);
            throw error;
        }
    }

    // Eliminar un producto de un carrito
    async deleteProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: true, message: 'El carrito no existe' };
            }
            const productIndex = cart.products.findIndex(item => {
                return item.product && item.product.equals(productId);
            });
            if (productIndex === -1) {
                return { error: true, message: 'El producto no está en el carrito' };
            }
            cart.products.splice(productIndex, 1);
            await cart.save();
            return { success: true, message: 'Producto eliminado del carrito' };
        } catch (error) {
            console.error('Error eliminando el producto del carrito', error);
            throw error;
        }
    }

    // Actualizar un carrito con nuevos productos
    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { message: 'El carrito no existe' };
            }
            cart.products = updatedProducts;
            await cart.save();
            return { message: "Carrito actualizado", cart };
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }

    // Actualizar la cantidad de un producto en un carrito
    async updateQuantity(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return { message: "El carrito indicado no existe." }
            }
            const product = cart.products.find(item => item.product && item.product.toString() === pid)
            if (!product) {
                return { message: "El producto no existe en el carrito." }
            }
            product.quantity = quantity;
            await cart.save();
            return { success: true, message: "cantidad actualizada" };
        } catch (error) {
            console.error('Error actualziando la cantidad', error);
            throw WebGLVertexArrayObject;
        }
    }

    // Vaciar un carrito
    async emptyCart(cid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return { message: "El carrito indicado no existe" };
            }
            cart.products = [];
            await cart.save();
            return { success: true, message: "Carrito Vacio" };
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }

    // Realizar la compra de un carrito
    async purchaseCart(cartId, purchaserEmail) {
        try {
            const { transporter, mailGenerator } = emailConfig;
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                return { error: true, message: 'El carrito no existe' };
            }
            const montoTotal = cart.products.reduce((total, item) => total + item.quantity * item.product.price, 0);

            const productos = cart.products.map((item) => ({
                name: item.product.name,
                description: item.product.description,
                quantity: item.quantity,
                price: item.product.price,
            }))

            const emailContent = {
                body: {
                    name: purchaserEmail,
                    intro: 'Gracias por tu compra. Aquí está el detalle de tu factura:',
                    table: {
                        data: productos.map((producto) => ({
                            item: producto.name,
                            description: producto.description,
                            quantity: producto.quantity,
                            price: producto.price,
                        })),
                    },
                    total: {
                        text: 'Total',
                        price: montoTotal,
                    },
                    outro: 'Si tiene alguna pregunta, no dudes en contactarnos.',
                },
            };

            // Generar contenido del correo
            const contenidoCorreo = mailGenerator.generate(emailContent);

            // Configuración del mensaje de correo
            const message = {
                from: process.env.GMAIL_USER,
                to: purchaserEmail,
                subject: 'Factura de compra',
                html: contenidoCorreo,
            };

            // Envía el correo
            await transporter.sendMail(message);

            console.log('Correo de factura enviado.');

            // Crea un ticket y actualiza el stock de productos
            const ticket = await this.createTicket(cartId, purchaserEmail);
            const productsToRemove = [];

            for (const item of cart.products) {
                const product = item.product;
                const quantityInCart = item.quantity;
                if (product.stock >= quantityInCart) {
                    product.stock -= quantityInCart;
                    await product.save();
                    productsToRemove.push(product._id);
                }
            }
            // Filtra los productos que ya fueron comprados
            cart.products = cart.products.filter(item => !productsToRemove.includes(item.product._id));
            // Guarda el carrito actualizado
            await cart.save();
            return { ticket: ticket };
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            throw error;
        }
    }

    // Crear un ticket de compra
    async createTicket(cartId, purchasertEmail) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                return { message: 'el carrito no existe.' }
            }

            let amount = 0;
            const products = [];
            for (const item of cart.products) {
                amount += item.product.price * item.quantity;
                products.push({
                    name: item.product.name,
                    description: item.product.description,
                    quantity: item.quantity,
                    price: item.product.price,
                })
            }

            const ticketCount = await ticketModel.countDocuments();

            const code = ticketCount + 1;

            const newTicket = new ticketModel({
                code: code,
                purchase_datetime: new Date(),
                amount: amount,
                purchaser: purchasertEmail,
            });

            await newTicket.save();

            return newTicket;
        } catch (error) {
            console.error('Error al crear el ticket: ', error);
            throw error;
        }
    }

}