import mongoose from "mongoose";

const ticketCollection = "ticket";

// Esquema para los documentos en la colección "ticket".
const ticketSchema = new mongoose.Schema({
    code: {type: String, unique: true, required: true,},
    purchase_datetime: {type: Date, default: Date.now,},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true},
});

// Crear modelo "ticketModel" a partir del esquema "ticketSchema".
const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;