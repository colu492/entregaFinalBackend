import ProductService from "../services/productService.js";
import { generateProduct } from "../utils.js";
import logger from "../services/logger.js";
import dotenv from 'dotenv'
import emailConfig from "../config/emailConfig.js";
dotenv.config()

// Instancia del servicio de productos
const productService = new ProductService();

const ProductController = {
    // Método para obtener todos los productos con opciones de paginación, orden y filtrado
    async GetAll(request, response) {
        try {
            const { limit = 10, page = 1, sort, query, filter } = request.query;

            const options = {
                limit: limit,
                page: page,
                sort: sort,
                query: query,
                filter: filter,
            };

            const result = await productService.getAllProducts(options);
            response.status(200).json(result);
        } catch (error) {
            logger.error('Error al obtener los productos', error)
            response.status(500).json({ message: 'Error al obtener los productos' });
        }
    },

    // Obtener producto por su ID
    async GetByID(request, response) {
        try {
            const { pid } = request.params;
            const product = await productService.getProductById(pid);
            if (product) {
                response.status(200).json(product);
            } else {
                response.status(404).json({ message: `El producto con el id ${pid} no se encuentra` });
            }
        } catch (error) {
            logger.error('Error al obtener el producto:', error)
            response.status(500).json({ message: 'Error al obtener el producto' });
        }
    },

    // Crear nuevo producto
    async CreateProduct(request, response) {
        try {
            const user = request.session.user;
            const productoNuevo = await productService.addProduct(request.body, user);
            response.status(201).json(productoNuevo);
        } catch (error) {
            logger.error('Error al crear el producto:', error);
            response.status(500).json({ message: 'Error al crear el producto' })
        }
    },

    // Actualizar producto
    async UpdateProduct(request, response) {
        try {
            const updatedProduct = await productService.updateProduct(request.params.pid, request.body)
            if (!updatedProduct) {
                logger.warning('Producto no encontrado')
                return response.status(404).json({ message: 'Producto no encontrado' });
            }
            response.status(200).json({ message: 'Producto actualizado con éxito' });
        } catch (error) {
            logger.error('Error al actualizar el Producto.', error);
            response.status(400).json({ message: error.message });
        }
    },

    // Eliminar producto
    async DeleteProduct(request, response) {
        try {
            const productId = request.params.pid;
            const user = request.session.user;
            const existProduct = await productService.getProductById(productId)
            if (!existProduct) {
                return response.status(404).json({ message: 'Producto no encontrado' })
            }

            if (user.role === 'admin' || (user.role === 'premium' && existProduct.owner === user.email)) {
                const deleted = await productService.deleteProduct(productId, user);

                if (deleted && user.role === 'premium' && existProduct.owner === user.email) {
                    const mailOptions = {
                        from: process.env.GMAIL_USER,
                        to: user.email,
                        subject: 'Tu producto ha sido eliminado.',
                        html: `Tu producto se ha eliminado del catálogo, si tienes alguna duda no dudes en contactarte.`,
                    };

                    await emailConfig.transporter.sendMail(mailOptions);
                    console.log("correo enviado")

                }
                response.status(200).json({ message: 'Producto eliminado con éxito' })
            } else {
                response.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            }
        } catch (error) {
            logger.error('Error al eliminar el producto')
            console.log(error)
            return response.status(500).json({ message: 'Error al eliminar el producto' })
        }
    },

    // Generar productos de prueba
    async MockProduct(request, response) {
        try {
            const products = []
            for (let index = 0; index < 10; index++) {
                products.push(generateProduct())
            }
            response.send({ status: 'success', payload: products })
        } catch {
            response.status(400).json({ message: 'error' });
        }
    }
}


export default ProductController;