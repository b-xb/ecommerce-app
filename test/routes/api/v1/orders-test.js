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

  describe('DELETE /api/v1/orders/{orderId}', () => {

    beforeEach('Insert test order data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY orders FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orders.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    afterEach('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderResponse.status, 401);

      const chrisOrderResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderResponse.status, 401);

    });

    it('Admin should be able to delete any order', async () => {

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

      const liamOrderDeleteResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderDeleteResponse.status, 204);

      const liamOrderGetResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderGetResponse.status, 404);

      const chrisOrderDeleteResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderDeleteResponse.status, 204);

      const chrisOrderGetResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderGetResponse.status, 404);

    });

    it('Non-admin should not be able to delete orders', async () => {

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

      const liamOrderDeleteResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderDeleteResponse.status, 403);

      const liamOrderGetResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31');

      assert.equal(liamOrderGetResponse.status, 200);

      const chrisOrderDeleteResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b');

      assert.equal(chrisOrderDeleteResponse.status, 403);

    });

  });

  describe('GET /api/v1/orders/{orderId}/status', () => {

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

    const liamOrderStatus = "accepted";
    const chrisOrderStatus = "created";

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status');

      assert.equal(liamOrderResponse.status, 401);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status');

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
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status');

      assert.equal(liamOrderResponse.status, 200);
      assert.equal(liamOrderResponse.body, liamOrderStatus);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status');

      assert.equal(chrisOrderResponse.status, 200);
      assert.equal(chrisOrderResponse.body, chrisOrderStatus);

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
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status');

      assert.equal(liamOrderResponse.status, 200);
      assert.equal(liamOrderResponse.body, liamOrderStatus);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status');

      assert.equal(chrisOrderResponse.status, 403);

    });
  });

  describe('PUT /api/v1/orders/{orderId}/status', () => {

    beforeEach('Insert test order data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY orders FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orders.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    afterEach('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    const liamOrderStatus = "accepted";
    const chrisOrderStatus = "created";

    const newLiamOrderStatus = "recieved";
    const newChrisOrderStatus = "posted";

    const newLiamOrderStatusInput = {
      "status": newLiamOrderStatus
    };
    const newChrisOrderStatusInput = {
      "status": newChrisOrderStatus
    };

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderResponse = await agent
        .put('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status')
        .type('application/json')
        .send(JSON.stringify(newLiamOrderStatusInput));

      assert.equal(liamOrderResponse.status, 401);

      const chrisOrderResponse = await agent
        .put('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status')
        .type('application/json')
        .send(JSON.stringify(newChrisOrderStatusInput));

      assert.equal(chrisOrderResponse.status, 401);

    });

    it('Admin should be able to update status of any order', async () => {

      const agent = request.agent(app)

      const userLogin = {
        "email":"ben@ben.com",
        "password":"benspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin));

      assert.equal(loginResponse.status, 200);

      const liamOrderUpdateResponse = await agent
        .put('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status')
        .type('application/json')
        .send(JSON.stringify(newLiamOrderStatusInput));

      assert.equal(liamOrderUpdateResponse.status, 200);
      assert.equal(liamOrderUpdateResponse.body, newLiamOrderStatus);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status');

      assert.equal(liamOrderResponse.status, 200);
      assert.equal(liamOrderResponse.body, newLiamOrderStatus);

      const chrisOrderUpdateResponse = await agent
        .put('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status')
        .type('application/json')
        .send(JSON.stringify(newChrisOrderStatusInput));

      assert.equal(chrisOrderUpdateResponse.status, 200);
      assert.equal(chrisOrderUpdateResponse.body, newChrisOrderStatus);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status');

      assert.equal(chrisOrderResponse.status, 200);
      assert.equal(chrisOrderResponse.body, newChrisOrderStatus);

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
        .send(JSON.stringify(userLogin));

      assert.equal(loginResponse.status, 200);

      const liamOrderUpdateResponse = await agent
        .put('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status')
        .type('application/json')
        .send(JSON.stringify(newLiamOrderStatusInput));

      assert.equal(liamOrderUpdateResponse.status, 403);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/status');

      assert.equal(liamOrderResponse.status, 200);
      assert.equal(liamOrderResponse.body, liamOrderStatus);

      const chrisOrderUpdateResponse = await agent
        .put('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/status')
        .type('application/json')
        .send(JSON.stringify(newChrisOrderStatusInput));

      assert.equal(chrisOrderUpdateResponse.status, 403);

    });
  });

  describe('GET /api/v1/orders/{orderId}/items', () => {

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

    before('Insert test order item data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY order_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orderItems.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    after('Remove test order item data', async () => {
      await pool.query(`TRUNCATE order_items CASCADE`)
    });

    after('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamOrderResponse.status, 401);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisOrderResponse.status, 401);

    });

    it('Admin should be able to see items for any order', async () => {

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
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamOrderResponse.status, 200);
      expect(liamOrderResponse.body).to.be.an.instanceof(Array);
      expect(liamOrderResponse.body).to.have.lengthOf(5);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisOrderResponse.status, 200);
      expect(chrisOrderResponse.body).to.be.an.instanceof(Array);
      expect(chrisOrderResponse.body).to.have.lengthOf(2);

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
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamOrderResponse.status, 200);
      expect(liamOrderResponse.body).to.be.an.instanceof(Array);
      expect(liamOrderResponse.body).to.have.lengthOf(5);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisOrderResponse.status, 403);

    });
  });

  describe('POST /api/v1/orders/{orderId}/items', () => {
    it.skip("TODO");
  });

  describe('DELETE /api/v1/orders/{orderId}/items', () => {

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

    beforeEach('Insert test order item data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY order_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orderItems.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    afterEach('Remove test order item data', async () => {
      await pool.query(`TRUNCATE order_items CASCADE`)
    });

    after('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamOrderResponse.status, 401);

      const chrisOrderResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisOrderResponse.status, 401);

    });

    it('Admin should be able to delete items for any order', async () => {

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

      const liamDeleteOrderItemsResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamDeleteOrderItemsResponse.status, 204);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamOrderResponse.status, 200);
      expect(liamOrderResponse.body).to.be.an.instanceof(Array);
      expect(liamOrderResponse.body).to.have.lengthOf(0);

      const chrisDeleteOrderItemsResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisDeleteOrderItemsResponse.status, 204);

      const chrisOrderResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisOrderResponse.status, 200);
      expect(chrisOrderResponse.body).to.be.an.instanceof(Array);
      expect(chrisOrderResponse.body).to.have.lengthOf(0);

    });

    it('Non-admin should not be able to delete order items directly', async () => {

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

      const liamDeleteOrderItemsResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamDeleteOrderItemsResponse.status, 403);

      const liamOrderResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items');

      assert.equal(liamOrderResponse.status, 200);
      expect(liamOrderResponse.body).to.be.an.instanceof(Array);
      expect(liamOrderResponse.body).to.have.lengthOf(5);

      const chrisDeleteOrderItemsResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items');

      assert.equal(chrisDeleteOrderItemsResponse.status, 403);

    });
  });

  describe('GET /api/v1/orders/{orderId}/items/{productId}', () => {

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

    before('Insert test order item data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY order_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orderItems.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    after('Remove test order item data', async () => {
      await pool.query(`TRUNCATE order_items CASCADE`)
    });

    after('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    const liamOrderItem = {
      "order_id":"27916b0f-8866-4cc6-a33c-0c8a17a12f31",
      "product_id":"9427fca9-92dc-4e89-ab25-0e1697909ca3",
      "amount":10,
      "unit_price":"1.00",
      "total_cost":"10.00",
    }

    const chrisOrderItem = {
      "order_id":"17e28cad-1fab-4859-b7f9-b592a0130e9b",
      "product_id":"39933790-4e28-4337-9e11-5cd87f14d8e6",
      "amount":5,
      "unit_price":"100.00",
      "total_cost":"500.00",
    }

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamOrderItemResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamOrderItemResponse.status, 401);

      const chrisOrderItemResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisOrderItemResponse.status, 401);

    });

    it('Admin should be able to see items for any order', async () => {

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

      const liamOrderItemResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamOrderItemResponse.status, 200);
      assert.deepEqual(liamOrderItemResponse.body, liamOrderItem);

      const chrisOrderItemResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisOrderItemResponse.status, 200);
      assert.deepEqual(chrisOrderItemResponse.body, chrisOrderItem);

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

      const liamOrderItemResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamOrderItemResponse.status, 200);
      assert.deepEqual(liamOrderItemResponse.body, liamOrderItem);

      const chrisOrderItemResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisOrderItemResponse.status, 403);

    });
  });

  describe('POST /api/v1/orders/{orderId}/items/{productId}', () => {
  });

  describe('DELETE /api/v1/orders/{orderId}/items/{productId}', () => {

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

    beforeEach('Insert test order item data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY order_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/orderItems.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    afterEach('Remove test order item data', async () => {
      await pool.query(`TRUNCATE order_items CASCADE`)
    });

    after('Remove test order data', async () => {
      await pool.query(`TRUNCATE orders CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamDeleteOrderItemResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamDeleteOrderItemResponse.status, 401);

      const chrisDeleteOrderItemResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisDeleteOrderItemResponse.status, 401);

    });

    it('Admin should be able to delete items for any order', async () => {

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

      const liamDeleteOrderItemResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamDeleteOrderItemResponse.status, 204);

      const liamOrderItemResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamOrderItemResponse.status, 404);

      const chrisDeleteOrderItemsResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisDeleteOrderItemsResponse.status, 204);

      const chrisOrderItemResponse = await agent
        .get('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisOrderItemResponse.status, 404);

    });

    it('Non-admin should not be able to update order items directly', async () => {

      const agent = request.agent(app);

      const userLogin = {
        "email":"liam@liam.com",
        "password":"liamspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      const liamDeleteOrderItemResponse = await agent
        .delete('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamDeleteOrderItemResponse.status, 204);

      const liamOrderItemResponse = await agent
        .get('/api/v1/orders/27916b0f-8866-4cc6-a33c-0c8a17a12f31/items/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(liamOrderItemResponse.status, 404);

      const chrisDeleteOrderItemsResponse = await agent
        .delete('/api/v1/orders/17e28cad-1fab-4859-b7f9-b592a0130e9b/items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(chrisDeleteOrderItemsResponse.status, 403);

   });

  });
})