import express from 'express';
import routerProducts from './routes/product.router.js';
import routerCart from './routes/cart.router.js';
import routerViews from './routes/views.router.js'
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import sessionRouter from './routes/session.router.js';
import session from 'express-session';
import initializePassport from './config/passport.config.js'
import passport from 'passport';
import MongoStore from 'connect-mongo';
import config from './config/config.js';
import errorHandler from './services/errors/error.js'
import loggerController from './controllers/loggerController.js'
import routerRecovery from './routes/recover.router.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import routerUser from './routes/user.router.js';
import Product from './models/products.model.js'
import productModel from './models/products.model.js';

// Obtener la URI de la configuración
const uri = config.uri

// Crear la aplicación de Express
const app = express()
const port = config.port || 8080

// Iniciar el servidor
const server = app.listen(port, () => console.log(`Server Up on port ${port}`));
const io = new Server(server)

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación proyecto final Coderhouse\nProgramación Backend',
            description: 'Increíble documentación sobre mi proyecto de programación Backend en Coderhouse'
        }
    },
    apis: ['./docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Configuración de la sesión
app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: "integradora2",
    }),
    secret: "Colu",
    resave: true,
    saveUninitialized: true
}));

// Inicialización de Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Configuración de rutas
app.use('/', routerViews);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);
app.use('/api/session', sessionRouter);
app.use('/api/recover-password', routerRecovery);
app.use('/api/users', routerUser)
app.get('/loggerTest', loggerController.testLogger);
app.use(errorHandler)

// Configuración de Socket.IO
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado!");

    socket.on('deleteProd', async (prodId) => {
        console.log('Evento "deleteProd" recibido con ID: ', prodId);
        try {
            const deletedProduct = await productModel.findByIdAndDelete(prodId);
            console.log('Producto eliminado:', deletedProduct);
            if (!deletedProduct) {
                socket.emit('error', { error: 'El producto no se pudo encontrar o eliminar.' });
            } else {
                const updatedProducts = await productModel.find();
                io.emit('products', updatedProducts);
                socket.emit('result', 'Producto eliminado exitosamente.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            socket.emit('error', { error: 'Ocurrió un error al eliminar el producto.' });
        }
    });

    socket.on('addProd', async (product) => {
        console.log('Evento "addProd" recibido con datos: ', product);
        try {
            const newProduct = new productModel({
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                thumbnails: product.thumbnails,
                status: product.status,
                code: product.code,
                stock: product.stock
            });

            console.log('Nuevo producto a agregar:', newProduct);
            const savedProduct = await newProduct.save();
            console.log('Producto guardado:', savedProduct);
            if (!savedProduct) {

                socket.emit('error', { error: 'El producto no se pudo agregar.' });
            } else {

                const updatedProducts = await productModel.find();
                io.emit('products', updatedProducts);

                socket.emit('result', 'Producto agregado exitosamente.');
            }
        } catch (error) {

            console.error('Error al agregar el producto:', error);
            socket.emit('error', { error: 'Ocurrió un error al agregar el producto.' });
        }
    });
});

// Conexión a la base de datos
mongoose.set('strictQuery', false)

try {
    await mongoose.connect(uri)
    console.log('DB conectada')

} catch (err) {
    console.log('No se pudo conectar a la BD')
}

export default app