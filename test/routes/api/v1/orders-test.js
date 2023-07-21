const {expect, assert} = require('chai');
const request = require('supertest');

const app = require('../../../../app');
const pool = require('../../../../models/database');

const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const { from: copyFrom } = require('pg-copy-streams');


describe('/api/v1/orders', () => {
  before('Insert test user data', async () => {

    await pool.query(`TRUNCATE users CASCADE`)
    await pool.query(`TRUNCATE products CASCADE`)

    const client = await pool.connect()
    try {
      const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
      const sourceStream = fs.createReadStream('mocks/users.csv')
      await pipeline(sourceStream, ingestStream)
    } finally {
      client.release()
    }
  });

  before('Insert test product data', async () => {
    const client = await pool.connect();
    try {
      const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
      const sourceStream = fs.createReadStream('mocks/products.csv')
      await pipeline(sourceStream, ingestStream)
    } finally {
      client.release();
    }
  });

  after('Remove test product data', async () => {
    await pool.query(`TRUNCATE products CASCADE`)
  });

  after('Remove test user data', async () => {
    await pool.query(`TRUNCATE users CASCADE`)
  });

  describe('GET /api/v1/orders', () => {

    before('Insert test order data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY orders FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orders.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    after('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const response = await request(app)
        .get('/api/v1/orders');

      assert.equal(response.status, 401);

    });

    it('Admin should be able to see all orders', async () => {

      const agent = request.agent(app)

      const userLogin = {
        "email":"ben@ben.com",
        "password":"benspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      const response = await agent
        .get('/api/v1/orders');

      assert.equal(response.status, 200);
      expect(response.body).to.be.an.instanceof(Array);
      expect(response.body).to.have.lengthOf(5);

    });

    it('Non-admin should not be able to use this path', async () => {

      const agent = request.agent(app)

      const userLogin = {
        "email":"liam@liam.com",
        "password":"liamspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      const response = await agent
        .get('/api/v1/orders');

      assert.equal(response.status, 403);

    });
  });

  describe('GET /api/v1/orders/{orderId}', () => {

    before('Insert test order data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY orders FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orders.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    after('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    const liamOrder = {
      "id":"27916b0f-8866-4cc6-a33c-0c8a17a12f31",
      "user_id": "8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
      "created":"2023-07-10T09:06:31.193Z",
      "status":"accepted",
    };

    const chrisOrder = {
      "id":"17e28cad-1fab-4859-b7f9-b592a0130e9b",
      "user_id": "9a7900a3-778c-4812-8b62-16ddd4e0c9e1",
      "created":"2023-07-21T09:06:31.193Z",
      "status":"created",
    };

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderResponse.status, 401);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderResponse.status, 401);

    });

    it('Admin should be able to see any order', async () => {

      const agent = request.agent(app)

      const userLogin = {
        "email":"ben@ben.com",
        "password":"benspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderResponse.status, 200);
      assert.deepEqual(liamOrderResponse.body, liamOrder);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderResponse.status, 200);
      assert.deepEqual(chrisOrderResponse.body, chrisOrder);

    });

    it('Non-admin should only be able to see their own orders', async () => {

      const agent = request.agent(app)

      const userLogin = {
        "email":"liam@liam.com",
        "password":"liamspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderResponse.status, 200);
      assert.deepEqual(liamOrderResponse.body, liamOrder);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderResponse.status, 403);

    });
  });

  describe('PUT /api/v1/orders/{orderId}', () => {
  });

  describe('DELETE /api/v1/orders/{orderId}', () => {
  });

  describe('GET /api/v1/orders/{orderId}/status', () => {
  });

  describe('PUT /api/v1/orders/{orderId}/status', () => {
  });

  describe('GET /api/v1/orders/{orderId}/items', () => {
  });

  describe('GET /api/v1/orders/{orderId}/items/{productId}', () => {
  });

  describe('POST /api/v1/orders/{orderId}/items', () => {
  });

  describe('DELETE /api/v1/orders/{orderId}/items', () => {
  });

  describe('GET /api/v1/orders/{orderId}/items/{productId}', () => {
  });

  describe('POST /api/v1/orders/{orderId}/items/{productId}', () => {
  });

  describe('DELETE /api/v1/orders/{orderId}/items/{productId}', () => {
  });
})