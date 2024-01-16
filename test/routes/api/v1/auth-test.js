const {expect, assert} = require('chai');
const request = require('supertest');
const { validate, version }  = require("uuid");

const app = require('../../../../app');
const pool = require('../../../../models/database');

const { pipeline } = require('node:stream/promises')
const fs = require('node:fs')
const { from: copyFrom } = require('pg-copy-streams')

describe('/api/v1/auth', () => {

  describe('POST /api/v1/auth/register', () => {

    afterEach('Remove test user data', async () => {
      await pool.query(`TRUNCATE users CASCADE`)
    });

    it('returns user information and 201 successfully created response', async () => {

      const newUser = {
        "name":"ben",
        "email":"ben@ben.com",
        "address":"My Address",
        "password":"benspassword",
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .type('application/json')
        .send(JSON.stringify(newUser));

      assert.equal(response.status, 201);

      const { id, name, email, address } = response.body;

      assert.equal(name, newUser.name);
      assert.equal(email, newUser.email);
      assert.equal(address, newUser.address);

      expect(validate(id)).to.be.true;
      assert.equal(version(id),4);
    });

    it('returns different user information and 201 successfully created response', async () => {

      const newUser = {
        "name":"liam",
        "email":"liam@liam.com",
        "address":"liam's address",
        "password":"liamspassword",
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .type('application/json')
        .send(JSON.stringify(newUser));
      
      assert.equal(response.status, 201);

      const { id, name, email, address } = response.body;

      assert.equal(name, newUser.name);
      assert.equal(email, newUser.email);
      assert.equal(address, newUser.address);

      expect(validate(id)).to.be.true;
      assert.equal(version(id),4);
    });

    it.skip('rejects invalid username', async () => {
    });

    it.skip('rejects invalid email', async () => {
    });

    it.skip('rejects invalid address', async () => {
    });

    it.skip('rejects invalid password', async () => {
    });

    it('allows newly registered user to log in', async () => {

      const newUser = {
        "name":"ben",
        "email":"ben@ben.com",
        "address":"My Address",
        "password":"benspassword",
      };

      const userLogin = {
        "email":"ben@ben.com",
        "password":"benspassword",
      };

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .type('application/json')
        .send(JSON.stringify(newUser))
      
      
      assert.equal(registerResponse.status, 201);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      assert.equal(loginResponse.body.message,"successful login");


    });

    it('allows different newly registered user to log in', async () => {

      const newUser = {
        "name":"liam",
        "email":"liam@liam.com",
        "address":"liam's address",
        "password":"liamspassword",
      };

      const userLogin = {
        "email":"liam@liam.com",
        "password":"liamspassword",
      };

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .type('application/json')
        .send(JSON.stringify(newUser))
      
      
      assert.equal(registerResponse.status, 201);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .type('application/json')
        .send(JSON.stringify(userLogin))

      assert.equal(loginResponse.status, 200);

      assert.equal(loginResponse.body.message,"successful login");



    });

    it.skip('must be logged out in order to register', () => {
    });
  });


  describe('POST /api/v1/auth/login', () => {
    it.skip('rejects login attempt when no password provided', () => {
    });

    it.skip('rejects login attempt when no username provided', () => {
    });

    it.skip('rejects login attempt when invalid username provided', () => {
    });

    it.skip('rejects login attempt when invalid password provided', () => {
    });

    it.skip('must be logged out in order to log in', () => {
    });
  });

  describe('POST /api/v1/auth/logout', () => {

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

    it('throws an error when logging out while not already logged in ', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      assert.equal(response.status, 401);
    });

    it('log out successfully when user is logged in', async () => {
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

      const response = await agent
        .post('/api/v1/auth/logout');

      assert.equal(response.status, 200);
    });
  });


  describe('POST /api/v1/auth/verify', () => {

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

    it('Returns a status OK response after the user logs in successfully', async () => {
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

      const response = await agent
        .get('/api/v1/auth/verify');

      assert.equal(response.status, 200);
    });

    it('Throws an unauthorised error response when there is not a valid session', async () => {
      const response = await request(app)
        .get('/api/v1/auth/verify');

      assert.equal(response.status, 401);
    });

    it('Throws an unauthorised error response after user logs out', async () => {
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

      const logoutResponse = await agent
        .post('/api/v1/auth/logout');

      assert.equal(logoutResponse.status, 200);

      const response = await agent
        .get('/api/v1/auth/verify');

      assert.equal(response.status, 401);
    });

    it('Throws an unauthorised error response after server session deleted', async () => {
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

      await pool.query(`TRUNCATE session CASCADE`)

      const response = await agent
        .get('/api/v1/auth/verify');

      assert.equal(response.status, 401);
    });
  });
});
