import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

// Esquema para los documentos en la colección "products".
const productSchema = mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    code: { type: String, required: true},
    price: { type: Number, required: true},
    status: { type: Boolean, required: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true},
    thumbnails: { type: String, required: true},
    owner: {
        type: String,
        default:'admin'
    }
});

// Plugin de paginación a la definición del esquema.
productSchema.plugin(mongoosePaginate);

// Crear modelo "productModel" a partir del esquema "productSchema"
const productModel = mongoose.model(productCollection, productSchema);

export default productModel