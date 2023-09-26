import fs from 'fs';

const cartsFilePath = './src/data/carts.json';

// Función para obtener todos los carritos
function getAllCarts() {
    try {
        const cartsData = fs.readFileSync(cartsFilePath, 'utf8');
        return JSON.parse(cartsData);
    } catch (error) {
        return [];
    }
}

// Función para obtener un carrito por su ID
function getCartById(cartId) {
    const carts = getAllCarts();
    return carts.find(cart => cart.id === cartId);
}

// Función para crear un nuevo carrito
function createCart() {
    const newCart = {
        id: generateUniqueId(), // Puedes implementar tu lógica para generar un ID único
        products: [],
    };
    const carts = getAllCarts();
    carts.push(newCart);
    saveCarts(carts);
    return newCart;
}

// Función para agregar un producto a un carrito
function addToCart(cartId, productId, quantity) {
    const carts = getAllCarts();
    const cart = getCartById(cartId);
    if (!cart) {
        return null;
    }

    // Aquí puedes implementar la lógica para agregar el producto al carrito
    // Verificar si el producto ya existe en el carrito y actualizar la cantidad, etc.

    saveCarts(carts);
    return cart;
}

// Función para guardar los carritos en el archivo JSON
function saveCarts(carts) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
}

// Función para generar un ID único (puedes implementar tu propia lógica)
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

export default {
    getAllCarts,
    getCartById,
    createCart,
    addToCart,
};
