import ProductManager from "../dao/productManager.js";

// Instancia de ProductManager
const productManager = new ProductManager();

class ProductService {
    // Obtener todos los productos con opciones de paginación y filtro
    async getAllProducts(options) {
        try {
            return await productManager.getProducts(options);
        } catch (error) {
            throw new Error("Error al obtener los productos: " + error.message);
        }
    }

    // Obtener un producto por su ID
    async getProductById(pid) {
        try {
            return await productManager.getProductsById(pid);
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    // Agregar un nuevo producto, se espera que el usuario sea proporcionado para la autorización
    async addProduct(product, user) {
        try {
            return await productManager.addProduct(product, user);
        } catch (error) {
            throw new Error("Error creando el producto: " + error.message);
        }
    }

    // Actualizar un producto por su ID con campos actualizados
    async updateProduct(id, updatedFields) {
        try {
            return await productManager.updateProduct(id, updatedFields);
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            return await productManager.deleteProduct(id);
        } catch (error) {
            throw new Error("Error intentando eliminar el producto: " + error.message);
        }
    }
}

export default ProductService;