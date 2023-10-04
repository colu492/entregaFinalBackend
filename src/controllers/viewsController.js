import productModel from "../models/products.model.js";
import cartModel from "../models/carts.model.js";

const viewsController = {
    // Renderizar la página de inicio con todos los productos
    async renderIndex(request, response) {
        const products = await productModel.find().lean().exec();
        response.render('index', { products });
    },

    // Renderizar la página de productos en tiempo real
    async renderRealTimeProducts(request, response) {
        try {
            const products = await productModel.find();
            const productsWithoutPrototype = JSON.parse(JSON.stringify(products));
            response.render("realTimeProducts", { products: productsWithoutPrototype });
        } catch (err) {
            response.status(500).send(err);
        }
    },

    // Renderizar la lista de productos 
    async renderProductList(request, response) {
        try {
            const { limit = 10, page = 1, sort, query, filter } = request.query;

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

            const result = await productModel.paginate(queryFilter, {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sortValue !== 0 ? { price: sortValue } : undefined,
                lean: true
            });

            const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

            const user = request.session.user;
            response.render('productList', {
                products: docs,
                user: {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    cart: user.cart
                },
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}&filter=${filter}` : '',
                nextLink: hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}&filter=${filter}` : ''
            });
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            response.status(500).send("Error interno del servidor");
        }
    },

    // Renderizar la página del carrito
    async renderCart(request, response) {
        const cid = request.params.cid
        try {
            const cart = await cartModel.findOne({ _id: cid }).lean();
            response.render("cart", { cart });
        } catch (error) {
            console.error("No se puede obtener el carrito: ", error);
            response.status(500).send("Error")
        }
    }
}

export default viewsController;