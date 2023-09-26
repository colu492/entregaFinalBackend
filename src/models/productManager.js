import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsFilePath = path.join(__dirname, '../data/products.json');

// Función para obtener todos los productos
async function getAllProducts() {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(productsData);
}

// Función para obtener un producto por ID
async function getProductById(productId) {
    const products = await getAllProducts();
    return products.find(product => product.id === productId);
}

// Función para agregar un nuevo producto
async function addProduct(newProduct) {
    const products = await getAllProducts();
    // Generar un nuevo ID (debes implementar la lógica para asegurarte de que sea único)
    newProduct.id = generateUniqueId();
    products.push(newProduct);
    await saveProducts(products);
    return newProduct;
}

// Función para actualizar un producto por ID
async function updateProduct(productId, updatedProduct) {
    const products = await getAllProducts();
    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
        return null; // Producto no encontrado
    }
    products[index] = updatedProduct;
    await saveProducts(products);
    return updatedProduct;
}

// Función para eliminar un producto por ID
async function deleteProduct(productId) {
    const products = await getAllProducts();
    const updatedProducts = products.filter(product => product.id !== productId);
    if (products.length === updatedProducts.length) {
        return null; // Producto no encontrado
    }
    await saveProducts(updatedProducts);
    return productId;
}

// Función para guardar los productos en el archivo
async function saveProducts(products) {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

// Función para generar un ID único (debes implementarla)
function generateUniqueId() {
    // Implementa la lógica para generar un ID único
}

export default {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
