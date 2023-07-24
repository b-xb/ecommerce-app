const {expect, assert} = require('chai');
const request = require('supertest');
const uuid  = require("uuid");

const app = require('../../../../app');

const { pipeline } = require('node:stream/promises')
const fs = require('node:fs')
const { from: copyFrom } = require('pg-copy-streams')

const pool = require('../../../../models/database')

describe('/api/v1/users', () => {

  describe('GET /api/v1/users', () => {

    before('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    })

    it('Public should not be able to see any user info', async () => {
      const response = await request(app)
        .get('/api/v1/users');

      assert.equal(response.status, 401);
    });

    it('Admin should be able to see all users', async () => {

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
        .get('/api/v1/users');

      assert.equal(response.status, 200);
      expect(response.body).to.be.an.instanceof(Array);
      expect(response.body).to.have.lengthOf(4);

    });

    it('User should only be able to see their own user info', async () => {

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
        .get('/api/v1/users');

      assert.equal(response.status, 200);
      expect(response.body).to.be.an.instanceof(Array);
      expect(response.body).to.have.lengthOf(1);

    });
  })

  describe('POST /api/v1/users', () => {

    beforeEach('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    })

    afterEach('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    })

    it('Admin should be able add a user', async () => {

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

      const newUser = {
        "name":"jack",
        "email":"jack@jack.com",
        "address":"Jack's Address",
        "password":"jacksspassword",
      };

      const response = await agent
        .post('/api/v1/users/')
        .type('application/json')
        .send(JSON.stringify(newUser));

      assert.equal(response.status, 201);
    });

    it('Non-admin users should not be able to use this path', async () => {

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

      const newUser = {
        "name":"jack",
        "email":"jack@jack.com",
        "address":"Jack's Address",
        "password":"jacksspassword",
      };

      const response = await agent
        .post('/api/v1/users/')
        .type('application/json')
        .send(JSON.stringify(newUser));

      assert.equal(response.status, 401);
    });

    it('Public should not be able to use this path', async () => {
      const response = await request(app)
        .post('/api/v1/users');

      assert.equal(response.status, 401);
    });
  })

  describe('GET /api/v1/users/{userId}', () => {

    before('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    })

    it('Admin should be able to see any users info', async () => {

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

      const benResponse = await agent
        .get('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      assert.equal(benResponse.status, 200);
      assert.deepEqual(benResponse.body, {
        "id": "3f90f3a6-4de0-498a-9b6c-ea0bf1b73791",
        "name": "ben",
        "email": "ben@ben.com",
        "address": "My address",
        "is_admin": true,
      });

      const liamResponse = await agent
      .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(liamResponse.status, 200);
      assert.deepEqual(liamResponse.body, {
        "id": "8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
        "name": "liam",
        "email": "liam@liam.com",
        "address": "Liam's address",
        "is_admin": false,
      });

      const chrisResponse = await agent
      .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(chrisResponse.status, 200);
      assert.deepEqual(chrisResponse.body, {
        "id": "9a7900a3-778c-4812-8b62-16ddd4e0c9e1",
        "name": "chris",
        "email": "chris@chris.com",
        "address": "Chris's address",
        "is_admin": false,
      });
    });

    it('User should only be able to see their own user info', async () => {

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

      const benResponse = await agent
        .get('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      assert.equal(benResponse.status, 403);

      const liamResponse = await agent
      .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(liamResponse.status, 200);
      assert.deepEqual(liamResponse.body, {
        "id": "8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
        "name": "liam",
        "email": "liam@liam.com",
        "address": "Liam's address",
        "is_admin": false,
      });

      const chrisResponse = await agent
      .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(chrisResponse.status, 403);
    });

    it('Public should not be able to see any user info', async () => {

      const agent = request.agent(app);

      const benResponse = await agent
        .get('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      assert.equal(benResponse.status, 401);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(liamResponse.status, 401);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(chrisResponse.status, 401);

    });
  });

  describe('PUT /api/v1/users/{userId}', () => {

    const newUserInfoForBen = {
      "name":"ben 2",
      "email":"ben2@ben.com",
      "address":"Ben's New Address"
    };

    const newUserInfoForLiam = {
      "name":"liam 2",
      "email":"liam2@liam.com",
      "address":"Liam's New Address"
    };

    const newUserInfoForChris = {
      "name":"chris 2",
      "email":"chris2@chris.com",
      "address":"Chris's New Address",
    };

    beforeEach('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    });

    afterEach('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });


    it('Admin should be able update any user', async () => {

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

      const updateBenResponse = await agent
        .put('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForBen));

      assert.equal(updateBenResponse.status, 200);

      const benResponse = await agent
      .get('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      assert.equal(benResponse.status, 200);
      assert.deepEqual(benResponse.body, {
        "id": "3f90f3a6-4de0-498a-9b6c-ea0bf1b73791",
        "name": "ben 2",
        "email": "ben2@ben.com",
        "address": "Ben's New Address",
        "is_admin": true,
      });

      const updateLiamResponse = await agent
        .put('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForLiam));

      assert.equal(updateLiamResponse.status, 200);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(liamResponse.status, 200);
      assert.deepEqual(liamResponse.body, {
        "id": "8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
        "name": "liam 2",
        "email": "liam2@liam.com",
        "address": "Liam's New Address",
        "is_admin": false,
      });

      const updateChrisResponse = await agent
        .put('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForChris));

      assert.equal(updateChrisResponse.status, 200);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(chrisResponse.status, 200);
      assert.deepEqual(chrisResponse.body, {
        "id": "9a7900a3-778c-4812-8b62-16ddd4e0c9e1",
        "name":"chris 2",
        "email":"chris2@chris.com",
        "address":"Chris's New Address",
        "is_admin": false,
      });
    })

    it('Logged in should only be able to update their username, email, name and password',  async () => {

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

      const updateBenResponse = await agent
        .put('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForBen));

      assert.equal(updateBenResponse.status, 403);

      const updateLiamResponse = await agent
        .put('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForLiam));

      assert.equal(updateLiamResponse.status, 200);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(liamResponse.status, 200);
      assert.deepEqual(liamResponse.body, {
        "id": "8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
        "name": "liam 2",
        "email": "liam2@liam.com",
        "address": "Liam's New Address",
        "is_admin": false,
      });

      const updateChrisResponse = await agent
        .put('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForChris));

      assert.equal(updateChrisResponse.status, 403);
    })

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const updateBenResponse = await agent
        .put('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForBen));

      assert.equal(updateBenResponse.status, 401);

      const updateLiamResponse = await agent
        .put('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForLiam));

      assert.equal(updateLiamResponse.status, 401);

      const updateChrisResponse = await agent
        .put('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1')
        .type('application/json')
        .send(JSON.stringify(newUserInfoForChris));

      assert.equal(updateChrisResponse.status, 401);
    });
  });

  describe('DELETE /api/v1/users/{userId}', () => {

    beforeEach('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    })

    afterEach('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    })

    it('Admin should be able delete any users', async () => {

      const agent = request.agent(app);

      const userLogin = {
        "email":"ben@ben.com",
        "password":"benspassword",
      };

      const loginResponse = await agent
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      // const deleteBenResponse = await agent
      //  .delete('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      // assert.equal(deleteBenResponse.status, 204);

      const deleteLiamResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(deleteLiamResponse.status, 204);

      const deleteChrisResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(deleteChrisResponse.status, 204);
    });

    it('Non-admin users should not be able to use this path', async () => {

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

      const deleteBenResponse = await agent
       .delete('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      assert.equal(deleteBenResponse.status, 403);

      const deleteLiamResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(deleteLiamResponse.status, 403);

      const deleteChrisResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(deleteChrisResponse.status, 403);
    });

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const deleteBenResponse = await agent
       .delete('/api/v1/users/3f90f3a6-4de0-498a-9b6c-ea0bf1b73791');

      assert.equal(deleteBenResponse.status, 401);

      const deleteLiamResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f');

      assert.equal(deleteLiamResponse.status, 401);

      const deleteChrisResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1');

      assert.equal(deleteChrisResponse.status, 401);
    });
  });

  describe('GET /api/v1/users/{userId}/cart-items', () => {

    before('Insert test user data', async () => {
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
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    });

    before('Insert test cart data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY cart_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`));
        const sourceStream = fs.createReadStream('mocks/cartItems.csv');
        await pipeline(sourceStream, ingestStream);
      } finally {
        client.release()
      }
    })

    after('Remove test cart_items data', async () => {
      await pool.query(`TRUNCATE cart_items CASCADE`);
    })

    after('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`);
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const liamResponse = await request(app)
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamResponse.status, 401);

      const chrisResponse = await request(app)
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items');

      assert.equal(chrisResponse.status, 401);

    });

    it(`Admin should be able to see any user's cart items`, async () => {

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

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(2);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items');

      assert.equal(chrisResponse.status, 200);
      expect(chrisResponse.body).to.be.an.instanceof(Array);
      expect(chrisResponse.body).to.have.lengthOf(3);

      const beeResponse = await agent
        .get('/api/v1/users/f9ffae5d-e3c6-4edc-a857-329fe8a13ec7/cart-items');

      assert.equal(beeResponse.status, 200);
      expect(beeResponse.body).to.be.an.instanceof(Array);
      expect(beeResponse.body).to.have.lengthOf(0);

    });

    it('Non-admin should be able to see their own cart items only', async () => {

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

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(2);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisResponse.status, 403);

    });
  });

  describe('DELETE /api/v1/users/{userId}/cart-items', () => {

    before('Insert test user data', async () => {
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
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    });

    beforeEach('Insert test cart data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY cart_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`));
        const sourceStream = fs.createReadStream('mocks/cartItems.csv');
        await pipeline(sourceStream, ingestStream);
      } finally {
        client.release()
      }
    })

    afterEach('Remove test cart_items data', async () => {
      await pool.query(`TRUNCATE cart_items CASCADE`);
    })

    after('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`);
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const liamResponse = await request(app)
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamResponse.status, 401);

      const chrisResponse = await request(app)
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items');

      assert.equal(chrisResponse.status, 401);

    });

    it(`Admin should be able to delete any user's cart items`, async () => {

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

      const liamDeleteResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamDeleteResponse.status, 204);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(0);

      const chrisDeleteResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items');

      assert.equal(chrisDeleteResponse.status, 204);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items');

      assert.equal(chrisResponse.status, 200);
      expect(chrisResponse.body).to.be.an.instanceof(Array);
      expect(chrisResponse.body).to.have.lengthOf(0);

      const beeResponse = await agent
        .delete('/api/v1/users/f9ffae5d-e3c6-4edc-a857-329fe8a13ec7/cart-items');

      assert.equal(beeResponse.status, 404);

    });

    it('Non-admin should be able to see their own cart items only', async () => {

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

      const liamDeleteResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamDeleteResponse.status, 204);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(0);

      const chrisDeleteResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items');

      assert.equal(chrisDeleteResponse.status, 403);

      const beeResponse = await agent
        .delete('/api/v1/users/f9ffae5d-e3c6-4edc-a857-329fe8a13ec7/cart-items');

      assert.equal(beeResponse.status, 403);

      });
  });

  describe('POST /api/v1/users/{userId}/cart-items/{productId}', () => {
    before('Insert test user data', async () => {
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
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    });

    beforeEach('Insert test cart data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY cart_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`));
        const sourceStream = fs.createReadStream('mocks/cartItems.csv');
        await pipeline(sourceStream, ingestStream);
      } finally {
        client.release()
      }
    })

    afterEach('Remove test cart_items data', async () => {
      await pool.query(`TRUNCATE cart_items CASCADE`);
    })

    after('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`);
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });

    const newLiamCartItem = {
      amount: 5,
    }

    const newChrisCartItem = {
      amount: 60,
    }

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamAddCartItemResponse = await agent
        .post('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/02cbea05-34be-49f5-8d15-f2b0cb242335')
        .type('application/json')
        .send(JSON.stringify(newLiamCartItem));

      assert.equal(liamAddCartItemResponse.status, 401);

      const chrisAddCartItemResponse = await agent
        .post('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(newChrisCartItem));

      assert.equal(chrisAddCartItemResponse.status, 401);

    });

    it('Admin should be able to add items to any order', async () => {

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

      const liamAddCartItemResponse = await agent
        .post('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/02cbea05-34be-49f5-8d15-f2b0cb242335')
        .type('application/json')
        .send(JSON.stringify(newLiamCartItem));

      assert.equal(liamAddCartItemResponse.status, 201);

      const liamCartResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/');

      assert.equal(liamCartResponse.status, 200);
      expect(liamCartResponse.body).to.be.an.instanceof(Array);
      expect(liamCartResponse.body).to.have.lengthOf(3);

      expect(liamCartResponse.body).to.include.deep.members([
        {
          "user_id":"8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
          "product_id":"02cbea05-34be-49f5-8d15-f2b0cb242335",
          "amount":5,
        }
      ]);

      const chrisAddCartItemResponse = await agent
        .post('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(newChrisCartItem));

      assert.equal(chrisAddCartItemResponse.status, 201);

      const chrisCartResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/');

      assert.equal(chrisCartResponse.status, 200);
      expect(chrisCartResponse.body).to.be.an.instanceof(Array);
      expect(chrisCartResponse.body).to.have.lengthOf(4);

      expect(chrisCartResponse.body).to.include.deep.members([
        {
          "user_id":"9a7900a3-778c-4812-8b62-16ddd4e0c9e1",
          "product_id":"6f2c3dc6-fde5-4852-8bd4-7a927b317204",
          "amount":60,
        }
      ]);
    });

    it('Non-admin should be able to delete own cart items only', async () => {

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

      const liamAddCartItemResponse = await agent
        .post('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/02cbea05-34be-49f5-8d15-f2b0cb242335')
        .type('application/json')
        .send(JSON.stringify(newLiamCartItem));

      assert.equal(liamAddCartItemResponse.status, 201);

      const liamCartResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/');

      assert.equal(liamCartResponse.status, 200);
      expect(liamCartResponse.body).to.be.an.instanceof(Array);
      expect(liamCartResponse.body).to.have.lengthOf(3);

      expect(liamCartResponse.body).to.include.deep.members([
        {
          "user_id":"8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
          "product_id":"02cbea05-34be-49f5-8d15-f2b0cb242335",
          "amount":5,
        }
      ]);

      const chrisAddCartItemResponse = await agent
        .post('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(newChrisCartItem));

      assert.equal(chrisAddCartItemResponse.status, 403);
    });
  });

  describe('PUT /api/v1/users/{userId}/cart-items/{productId}', () => {
    before('Insert test user data', async () => {
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
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    });

    beforeEach('Insert test cart data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY cart_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`));
        const sourceStream = fs.createReadStream('mocks/cartItems.csv');
        await pipeline(sourceStream, ingestStream);
      } finally {
        client.release()
      }
    })

    afterEach('Remove test cart_items data', async () => {
      await pool.query(`TRUNCATE cart_items CASCADE`);
    })

    after('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`);
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });

    const liamCartItemUpdate = {
      amount: 3,
    }

    const chrisCartItemUpdate = {
      amount: 27,
    }

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamUpdateCartItemResponse = await agent
        .put('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(liamCartItemUpdate));

      assert.equal(liamUpdateCartItemResponse.status, 401);

      const chrisUpdateCartItemResponse = await agent
        .put('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/02cbea05-34be-49f5-8d15-f2b0cb242335')
        .type('application/json')
        .send(JSON.stringify(chrisCartItemUpdate));

      assert.equal(chrisUpdateCartItemResponse.status, 401);

    });

    it('Admin should be able to add items to any order', async () => {

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

      const liamUpdateCartItemResponse = await agent
        .put('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(liamCartItemUpdate));

      assert.equal(liamUpdateCartItemResponse.status, 200);

      const liamCartResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/');

      assert.equal(liamCartResponse.status, 200);
      expect(liamCartResponse.body).to.be.an.instanceof(Array);
      expect(liamCartResponse.body).to.have.lengthOf(2);

      expect(liamCartResponse.body).to.include.deep.members([
        {
          "user_id":"8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
          "product_id":"6f2c3dc6-fde5-4852-8bd4-7a927b317204",
          "amount":3,
        }
      ]);

      const chrisUpdateCartItemResponse = await agent
        .put('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/02cbea05-34be-49f5-8d15-f2b0cb242335')
        .type('application/json')
        .send(JSON.stringify(chrisCartItemUpdate));

      assert.equal(chrisUpdateCartItemResponse.status, 200);

      const chrisCartResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/');

      assert.equal(chrisCartResponse.status, 200);
      expect(chrisCartResponse.body).to.be.an.instanceof(Array);
      expect(chrisCartResponse.body).to.have.lengthOf(3);

      expect(chrisCartResponse.body).to.include.deep.members([
        {
          "user_id":"9a7900a3-778c-4812-8b62-16ddd4e0c9e1",
          "product_id":"02cbea05-34be-49f5-8d15-f2b0cb242335",
          "amount":27,
        }
      ]);
    });

    it('Non-admin should be able to delete own cart items only', async () => {

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

      const liamUpdateCartItemResponse = await agent
        .put('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/6f2c3dc6-fde5-4852-8bd4-7a927b317204')
        .type('application/json')
        .send(JSON.stringify(liamCartItemUpdate));

      assert.equal(liamUpdateCartItemResponse.status, 200);

      const liamCartResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/');

      assert.equal(liamCartResponse.status, 200);
      expect(liamCartResponse.body).to.be.an.instanceof(Array);
      expect(liamCartResponse.body).to.have.lengthOf(2);

      expect(liamCartResponse.body).to.include.deep.members([
        {
          "user_id":"8552a25d-1b11-4cf2-a59c-ee41b75fc45f",
          "product_id":"6f2c3dc6-fde5-4852-8bd4-7a927b317204",
          "amount":3,
        }
      ]);

      const chrisUpdateCartItemResponse = await agent
        .put('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/02cbea05-34be-49f5-8d15-f2b0cb242335')
        .type('application/json')
        .send(JSON.stringify(chrisCartItemUpdate));

      assert.equal(chrisUpdateCartItemResponse.status, 403);
    });
  });

  describe('DELETE /api/v1/users/{userId}/cart-items/{productId}', () => {

    before('Insert test user data', async () => {
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
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY products FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/products.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    });

    beforeEach('Insert test cart data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY cart_items FROM STDIN delimiter ',' NULL AS 'NULL' csv header`));
        const sourceStream = fs.createReadStream('mocks/cartItems.csv');
        await pipeline(sourceStream, ingestStream);
      } finally {
        client.release()
      }
    })

    afterEach('Remove test cart_items data', async () => {
      await pool.query(`TRUNCATE cart_items CASCADE`);
    })

    after('Remove test product data', async () => {
      await pool.query(`TRUNCATE products CASCADE`);
    })

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });

    it('Public should not be able to use this path', async () => {

      const agent = request.agent(app);

      const liamDeleteCartItemResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(liamDeleteCartItemResponse.status, 401);

      const chrisDeleteCartItemResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/0de0ab2a-eefd-4cae-a5a1-f961a669212e');

      assert.equal(chrisDeleteCartItemResponse.status, 401);

    });

    it('Admin should be able to add items to any order', async () => {

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

      const liamDeleteCartItemResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(liamDeleteCartItemResponse.status, 204);

      const liamCartResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/');

      assert.equal(liamCartResponse.status, 200);
      expect(liamCartResponse.body).to.be.an.instanceof(Array);
      expect(liamCartResponse.body).to.have.lengthOf(1);

      const chrisDeleteCartItemResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/0de0ab2a-eefd-4cae-a5a1-f961a669212e');

      assert.equal(chrisDeleteCartItemResponse.status, 204);

      const chrisCartResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/');

      assert.equal(chrisCartResponse.status, 200);
      expect(chrisCartResponse.body).to.be.an.instanceof(Array);
      expect(chrisCartResponse.body).to.have.lengthOf(2);
    });

    it('Non-admin should be able to delete own cart items only', async () => {

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

      const liamDeleteCartItemResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/39933790-4e28-4337-9e11-5cd87f14d8e6');

      assert.equal(liamDeleteCartItemResponse.status, 204);

      const liamCartResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/cart-items/');

      assert.equal(liamCartResponse.status, 200);
      expect(liamCartResponse.body).to.be.an.instanceof(Array);
      expect(liamCartResponse.body).to.have.lengthOf(1);

      const chrisDeleteCartItemResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/cart-items/0de0ab2a-eefd-4cae-a5a1-f961a669212e');

      assert.equal(chrisDeleteCartItemResponse.status, 403);
    });
  });

  describe('GET /api/v1/users/{userId}/orders', () => {

    before('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    })

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

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    })

    it('Public should not be able to use this path', async () => {

      const liamResponse = await request(app)
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamResponse.status, 401);

      const chrisResponse = await request(app)
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisResponse.status, 401);

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

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(3);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisResponse.status, 200);
      expect(chrisResponse.body).to.be.an.instanceof(Array);
      expect(chrisResponse.body).to.have.lengthOf(2);

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

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(3);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisResponse.status, 403);

    });
  });

  describe('POST /api/v1/users/{userId}/orders', () => {
    it.skip("TODO");
  });

  describe('DELETE /api/v1/users/{userId}/orders', () => {

    before('Insert test user data', async () => {
      const client = await pool.connect()
      try {
        const ingestStream = client.query(copyFrom(`COPY users FROM STDIN delimiter ',' NULL AS 'NULL' csv header`))
        const sourceStream = fs.createReadStream('mocks/users.csv')
        await pipeline(sourceStream, ingestStream)
      } finally {
        client.release()
      }
    })

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

    after('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    })

    it('Public should not be able to use this path', async () => {

      const liamResponse = await request(app)
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamResponse.status, 401);

      const chrisResponse = await request(app)
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisResponse.status, 401);

    });

    it('Admin should be able to delete all orders', async () => {

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

      const liamDeleteResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamDeleteResponse.status, 204);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(0);

      const chrisDeleteResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisDeleteResponse.status, 204);

      const chrisResponse = await agent
        .get('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisResponse.status, 200);
      expect(chrisResponse.body).to.be.an.instanceof(Array);
      expect(chrisResponse.body).to.have.lengthOf(0);

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

      const liamDeleteResponse = await agent
        .delete('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamDeleteResponse.status, 403);

      const liamResponse = await agent
        .get('/api/v1/users/8552a25d-1b11-4cf2-a59c-ee41b75fc45f/orders');

      assert.equal(liamResponse.status, 200);
      expect(liamResponse.body).to.be.an.instanceof(Array);
      expect(liamResponse.body).to.have.lengthOf(3);

      const chrisDeleteResponse = await agent
        .delete('/api/v1/users/9a7900a3-778c-4812-8b62-16ddd4e0c9e1/orders');

      assert.equal(chrisDeleteResponse.status, 403);

    });
  });
});