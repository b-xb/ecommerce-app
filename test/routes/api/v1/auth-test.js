const {expect, assert} = require('chai');
const request = require('supertest');
const { validate, version }  = require("uuid");

const app = require('../../../../app');
const pool = require('../../../../models/database');

describe('/api/v1/auth', () => {

  describe('POST /api/v1/auth/register', () => {

    beforeEach('create temporary pg table',async function () {
      await pool.query('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)') // This will copy constraints also
    })

    afterEach('dispose of temporary pg table',async function () {
      await pool.query('DROP TABLE IF EXISTS pg_temp.users');
    })

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

        const { id, name, email, address } = loginResponse.body;

        assert.equal(name, newUser.name);
        assert.equal(email, newUser.email);
        assert.equal(address, newUser.address);

        expect(validate(id)).to.be.true;
        assert.equal(version(id),4);
        assert.equal(id, registerResponse.body.id);
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

        const { id, name, email, address } = loginResponse.body;

        assert.equal(name, newUser.name);
        assert.equal(email, newUser.email);
        assert.equal(address, newUser.address);

        expect(validate(id)).to.be.true;
        assert.equal(version(id),4);
        assert.equal(id, registerResponse.body.id);
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
  })
});
