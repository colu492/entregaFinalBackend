import express from 'express';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js'; // Asegúrate de importar el cartRouter

const app = express();
const PORT = 8080;

// Aumenta el límite de listeners para evitar la advertencia (si es necesario)
app.setMaxListeners(15);

// Middleware para el manejo de datos JSON
app.use(express.json());

// Configura las rutas de productos
app.use('/api/products', productRouter);

// Configura las rutas de carritos
app.use('/api/carts', cartRouter);

// Configura el servidor para escuchar en el puerto 8080
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
