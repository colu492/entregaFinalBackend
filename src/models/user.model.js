import mongoose from "mongoose";

const userCollection = 'users'

// Esquema para los documentos en la colección "users".
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'premium', 'admin']
    },
    status: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'activo'],
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: Date,
})

// Desactiva el modo estricto para evitar errores.
mongoose.set('strictQuery', false)
// Crear modelo "userModel" a partir del esquema "userSchema".
const userModel = mongoose.model(userCollection, userSchema)

export default userModel