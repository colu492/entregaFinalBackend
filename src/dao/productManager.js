import productModel from '../models/products.model.js'
import ProductRepository from '../services/productRepository.js';
import CustomError from '../services/errors/CustomError.js';
import Errors from '../services/errors/Errors.js';

export default class ProductManager extends ProductRepository {
    // Obtener productos paginados con opciones de filtrado y clasificación
    async getProducts(options) {
        const { limit = 10, page = 1, sort, query, filter } = options;

        let sortValue = 0;
        if (sort === "desc") {
            sortValue = -1;
        } else if (sort === "asc") {
            sortValue = 1;
        }

        const queryFilter = {};
        if (query === "title") {
            queryFilter.title = filter;
        } else if (query === "category") {
            queryFilter.category = filter;
        }

        const paginationOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortValue !== 0 ? { price: sortValue } : undefined,
        };

        try {
            const result = await productModel.paginate(queryFilter, paginationOptions)
            const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

            const response = {
                status: "success",
                payload: docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}` : null,
                nextLink: hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}` : null,
            };

            return response;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            throw new CustomError.createError({
                name: "Error al obtener los productos",
                cause: error,
                message: "Se produjo un error al intentar obtener la lista de productos.",
                code: Errors.GET_PRODUCTS_ERROR,
            });
        }
    }

    // Obtener un producto por su ID
    async getProductsById(pid) {
        try {
            const foundProduct = await productModel.findById(pid);
            return foundProduct;
        } catch (error) {
            throw new CustomError.createError({
                name: "Producto no encontrado",
                cause: error,
                message: "El producto solicitado no fue encontrado en la base de datos.",
                code: Errors.PRODUCT_NOT_FOUND,
            });
        }
    }

    // Agregar un nuevo producto al catálogo
    async addProduct(product, user) {
        try {
            if (user.role === "premium") {
                product.owner = user.email;
            } else {
                product.owner = "admin";
            }
            const newProduct = await productModel.create(product);
            return newProduct;
        } catch (error) {
            console.error("Error creando el producto:", error);
            throw new CustomError.createError({
                name: "Error al crear el producto",
                cause: error,
                message: "Se produjo un error al intentar agregar el producto al catalogo.",
                code: Errors.ADD_PRODUCT_ERROR,
            });
        }
    }

    // Actualizar un producto por su ID
    async updateProduct(id, updatedFields) {
        try {
            const product = await productModel.findByIdAndUpdate(
                id,
                { $set: updatedFields },
                { new: true }
            );
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new CustomError.createError({
                name: "Error al actualizar el producto",
                cause: error,
                message: "Se produjo un error al intentar actualizar el producto.",
                code: Errors.UPDATE_PRODUCT_ERROR,
            });
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            const deletedproduct = await productModel.findByIdAndDelete(id);
            return !!deletedproduct
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new CustomError.createError({
                name: "Error al eliminar el producto",
                cause: error,
                message: "Se produjo un error al intentar eliminar el producto.",
                code: Errors.DELETE_PRODUCT_ERROR,
            });
        }
    }
}