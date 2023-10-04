import Errors from "./Errors.js";

// Middleware para manejar errores
export default (error, req, res, next) => {
    console.log(error.cause);


    // Manejo de diferentes códigos de error y envío de respuestas
    switch (error.code) {
        case Errors.GET_PRODUCTS_ERROR:
            res.status(500).send({ status: 'error', error: 'Error al obtener los productos' });
            break;

        case Errors.PRODUCT_NOT_FOUND:
            res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
            break;

        case Errors.ADD_PRODUCT_ERROR:
            res.status(500).send({ status: 'error', error: 'Error al agregar el producto' });
            break;

        case Errors.UPDATE_PRODUCT_ERROR:
            res.status(500).send({ status: 'error', error: 'Error al actualizar el producto' });
            break;

        case Errors.DELETE_PRODUCT_ERROR:
            res.status(500).send({ status: 'error', error: 'Error al eliminar el producto' });
            break;

        default:
            // En caso de un error no manejado, enviar una respuesta de error genérica
            res.send({ status: 'error', error: 'Unhandled error' });
            break;
    }
};