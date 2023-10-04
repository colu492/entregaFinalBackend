import supertest from "supertest";
import chai from "chai";
import cartModel from "../src/model/carts.model.js";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Cart Router', () => {
    let cartId;
    let productId = '6474ffd245ca448a2b63abd2';
    let authenticatedSessionUser;

    // Antes de todas las pruebas, realiza el inicio de sesión autenticado
    before(async () => {
        authenticatedSessionUser = await requester
            .post(`/api/session/login`)
            .send({ email: 'manuelcamilo16@gmail.com', password: 'secreto' });
    });

    // Después de todas las pruebas, realiza el cierre de sesión
    after(async () => {
        await requester
            .get(`/api/session/logout`);
    });
    
    it('Debe crear un carrito nuevo', async () => {
        const newCart = new cartModel({
            products: []
        });

        const response = await requester
            .post('/api/carts')
            .send(newCart);

        cartId = response.body.cart._id;

        expect(response.status).to.equal(201);
        expect(cartId).to.be.a('string');
    });

    it('Debe devolver un carrito a partir de su ID', async () => {
        const response = await requester
            .get(`/api/carts/${cartId}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id', cartId);
    });

    it('Debe agregar un producto al carrito (auth)', async () => {
        const responseUser = await requester
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', authenticatedSessionUser.headers['set-cookie']);

        expect(responseUser.status).to.equal(201);
    });
});