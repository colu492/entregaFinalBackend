import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Product Router', () => {
    let authenticatedSessionUser;
    let createdProductID;

    before(async () => {
        authenticatedSessionUser = await requester
            .post(`/api/session/login`)
            .send({ email: 'premiumcoder@coder.com', password: 'secretoP' });
    });

    it('Debe crear un nuevo producto', async () => {
        const newProduct = {
            title: 'Producto nuevo test',
            description: 'Descripción del producto creado para test',
            code: 'TEST001',
            price: 99.99,
            status: true,
            stock: 100,
            category: 'Testeo',
            thumbnails: 'none',
            owner: 'admin'
        };

        const response = await requester
            .post('/api/products')
            .set('Cookie', authenticatedSessionUser.headers['set-cookie'])
            .send(newProduct);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('_id');
        createdProductID = response.body._id;
    });

    it('Debe obtener todos los productos', async () => {
        const response = await requester.get('/api/products');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array'); // Cambiado a array ya que esperas un array de productos
    });

    it('Debe obtener un producto por ID', async () => {
        const response = await requester.get(`/api/products/${createdProductID}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id', createdProductID.toString());
    });

    it('Debe obtener productos mock', async () => {
        const response = await requester.get('/api/products/mockingproducts');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('payload').that.is.an('array');
        expect(response.body.payload).to.have.lengthOf(10);
    });

    after(async () => {
        if (createdProductID) {
            await requester
                .delete(`/api/products/${createdProductID}`)
                .set('Cookie', authenticatedSessionUser.headers['set-cookie']);
        }
    });
});
