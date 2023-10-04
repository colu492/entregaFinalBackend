import mongoose from "mongoose";

const cartCollection = "carts";

// Esquema para los documentos en la colección "carts".
const cartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

// Middleware para realizar la población automática de los productos con findOne
cartSchema.pre("findOne", function () {
    this.populate("products.product");
});

// Crear el modelo
const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;