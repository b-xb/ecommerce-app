const {expect, assert} = require('chai');
const request = require('supertest');

const app = require('../../../../app');
const pool = require('../../../../models/database');

const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const { from: copyFrom } = require('pg-copy-streams');

describe('/api/v1/products', () => {

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

  after('Remove test user data', async () => {
    await pool.query(`TRUNCATE users CASCADE`)
  });

  describe('GET /api/v1/products', () => {

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

    it('Public should be able to see all products', async () => {

      const response = await request(app)
        .get('/api/v1/products');

      assert.equal(response.status, 200);
      expect(response.body).to.be.an.instanceof(Array);
      expect(response.body).to.have.lengthOf(5);

    });

    it('Admin should be able to see all products', async () => {

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
        .get('/api/v1/products');

      assert.equal(response.status, 200);
      expect(response.body).to.be.an.instanceof(Array);
      expect(response.body).to.have.lengthOf(5);

    });

    it('Non-admin should only be able to see all products', async () => {

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
        .get('/api/v1/products');

      assert.equal(response.status, 200);
      expect(response.body).to.be.an.instanceof(Array);
      expect(response.body).to.have.lengthOf(5);

    });
  });

  describe('POST /api/v1/products', () => {

    afterEach('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`)
    });

    it('Public should not be able to add products', async () => {

      const agent = request.agent(app)

      const newProduct = {
        "name":"Mouldy Cheese",
        "description":"Smelly and undesirable. Not expensive.",
        "unitPrice":1.00,
        "stock":10,
      };

      const response = await agent
        .post('/api/v1/products')
        .type('application/json')
        .send(JSON.stringify(newProduct));

      assert.equal(response.status, 401);
    });

    it('Admin should be able to add products', async () => {

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

      const newProduct = {
        "name":"Mouldy Cheese",
        "description":"Smelly and undesirable. Not expensive.",
        "unitPrice":1.00,
        "stock":10,
      };

      const response = await agent
        .post('/api/v1/products')
        .type('application/json')
        .send(JSON.stringify(newProduct));

      assert.equal(response.status, 201);

    });

    it('Non-admin should not be able to add products', async () => {

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

      const newProduct = {
        "name":"Mouldy Cheese",
        "description":"Smelly and undesirable. Not expensive.",
        "unitPrice":1.00,
        "stock":10,
      };

      const response = await agent
        .post('/api/v1/products')
        .type('application/json')
        .send(JSON.stringify(newProduct));

      assert.equal(response.status, 401);

    });
  });

  describe('GET /api/v1/products/{productId}', () => {

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

    const redPokeBall = {
      "id":"9427fca9-92dc-4e89-ab25-0e1697909ca3",
      "name":"Red Poke Ball",
      "description":"Red and holds Pokemon",
      "unit_price":"1.00",
      "stock":200,
    };

    const platinumPokeBall = {
      "id":"39933790-4e28-4337-9e11-5cd87f14d8e6",
      "name":"Platinum Poke Ball",
      "description":"Platinum and holds Pokemon",
      "unit_price":"100.00",
      "stock":10,
    };

    it('Public should be able to see any products', async () => {

      const agent = request.agent(app)

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redPokeBall);

      const platinumBallResponse = await agent
        .get('/api/v1/products/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(platinumBallResponse.status, 200);
      assert.deepEqual(platinumBallResponse.body, platinumPokeBall);

    });

    it('Admin should be able to see all products', async () => {

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

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redPokeBall);

      const platinumBallResponse = await agent
        .get('/api/v1/products/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(platinumBallResponse.status, 200);
      assert.deepEqual(platinumBallResponse.body, platinumPokeBall);

    });

    it('Non-admin should only be able to see all products', async () => {

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

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redPokeBall);

      const platinumBallResponse = await agent
        .get('/api/v1/products/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(platinumBallResponse.status, 200);
      assert.deepEqual(platinumBallResponse.body, platinumPokeBall);

    });
  });

  describe('PUT /api/v1/products/{productId}', () => {

    beforeEach('Insert test product data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    afterEach('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`)
    });

    const redBall = {
      "id":"9427fca9-92dc-4e89-ab25-0e1697909ca3",
      "name":"Red Poke Ball",
      "description":"Red and holds Pokemon",
      "unit_price":"1.00",
      "stock":200
    };

    const newRedBallInfo = {
      "name":"Red and Silver Poke Ball",
      "description":"Red and Silver and holds Pokemon",
      "unitPrice":"1.50",
      "stock":150
    };

    const newRedBall = {
      "id":redBall.id,
      "name":newRedBallInfo.name,
      "description":newRedBallInfo.description,
      "unit_price":newRedBallInfo.unitPrice,
      "stock":newRedBallInfo.stock
    };

    const goldBall = {
      "id":"6f2c3dc6-fde5-4852-8bd4-7a927b317204",
      "name":"Gold Poke Ball",
      "description":"Gold and holds Pokemon",
      "unit_price":"50.00",
      "stock":50
    };

    const newGoldBallInfo = {
      "name":"Gold Coloured Poke Ball",
      "description":"Gold Coloured Poke Ball",
      "unitPrice":"30.00",
      "stock":100
    };

    const newGoldBall = {
      "id":goldBall.id,
      "name":newGoldBallInfo.name,
      "description":newGoldBallInfo.description,
      "unit_price":newGoldBallInfo.unitPrice,
      "stock":newGoldBallInfo.stock
    };

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app)

      const updateRedBallResponse = await agent
        .put('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3')
        .type('application/json')
        .send(JSON.stringify(newRedBallInfo));

      assert.equal(updateRedBallResponse.status, 401);

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redBall);

      const updateGoldBallResponse = await agent
        .put('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(newGoldBallInfo));

      assert.equal(updateGoldBallResponse.status, 401);

      const goldBallResponse = await agent
        .get('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(goldBallResponse.status, 200);
      assert.deepEqual(goldBallResponse.body, goldBall);

    });

    it('Admin should be able to update any product', async () => {

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

      const updateRedBallResponse = await agent
        .put('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3')
        .type('application/json')
        .send(JSON.stringify(newRedBallInfo));

      assert.equal(updateRedBallResponse.status, 200);

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, newRedBall);

      const updateGoldBallResponse = await agent
        .put('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(newGoldBallInfo));

      assert.equal(updateGoldBallResponse.status, 200);

      const goldBallResponse = await agent
        .get('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(goldBallResponse.status, 200);
      assert.deepEqual(goldBallResponse.body, newGoldBall);
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

      const updateRedBallResponse = await agent
        .put('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3')
        .type('application/json')
        .send(JSON.stringify(newRedBallInfo));

      assert.equal(updateRedBallResponse.status, 403);

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redBall);

      const updateGoldBallResponse = await agent
        .put('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(newGoldBallInfo));

      assert.equal(updateGoldBallResponse.status, 403);

      const goldBallResponse = await agent
        .get('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(goldBallResponse.status, 200);
      assert.deepEqual(goldBallResponse.body, goldBall);

    });
  });

  describe('DELETE /api/v1/products/{productId}', () => {

    beforeEach('Insert test product data', async () => {
      const client = await pool.connect();
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release();
      }
    });

    afterEach('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`)
    });

    const redBall = {
      "id":"9427fca9-92dc-4e89-ab25-0e1697909ca3",
      "name":"Red Poke Ball",
      "description":"Red and holds Pokemon",
      "unit_price":"1.00",
      "stock":200
    };

    const goldBall = {
      "id":"6f2c3dc6-fde5-4852-8bd4-7a927b317204",
      "name":"Gold Poke Ball",
      "description":"Gold and holds Pokemon",
      "unit_price":"50.00",
      "stock":50
    };

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app)

      const deleteRedBallResponse = await agent
        .delete('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(deleteRedBallResponse.status, 401);

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redBall);

      const deleteGoldBallResponse = await agent
        .delete('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(deleteGoldBallResponse.status, 401);

      const goldBallResponse = await agent
        .get('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(goldBallResponse.status, 200);
      assert.deepEqual(goldBallResponse.body, goldBall);

    });

    it('Admin should be able to delete any product', async () => {

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

      const deleteRedBallResponse = await agent
        .delete('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(deleteRedBallResponse.status, 204);

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 404);

      const deleteGoldBallResponse = await agent
        .delete('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(deleteGoldBallResponse.status, 204);

      const goldBallResponse = await agent
        .get('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(goldBallResponse.status, 404);
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

      const deleteRedBallResponse = await agent
        .delete('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(deleteRedBallResponse.status, 403);

      const redBallResponse = await agent
        .get('/api/v1/products/9427fca9-92dc-4e89-ab25-0e1697909ca3');

      assert.equal(redBallResponse.status, 200);
      assert.deepEqual(redBallResponse.body, redBall);

      const deleteGoldBallResponse = await agent
        .delete('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(deleteGoldBallResponse.status, 403);

      const goldBallResponse = await agent
        .get('/api/v1/products/6f2c3dc6-fde5-4852-8bd4-7a927b317204');

      assert.equal(goldBallResponse.status, 200);
      assert.deepEqual(goldBallResponse.body, goldBall);

    });
  });

});