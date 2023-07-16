const {expect, assert} = require('chai');
const request = require('supertest');

const app = require('../../../../app');

const { pipeline } = require('node:stream/promises')
const fs = require('node:fs')
const { from: copyFrom } = require('pg-copy-streams')


const pool = require('../../../../models/database')

describe('/api/v1/users', () => {

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

  describe('GET /api/v1/users', () => {

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
      expect(response.body).to.have.lengthOf(2);

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
    it.skip('Admin should be able add a user')
    it.skip('Non-admin users should not be able to use this path')
    it.skip('Public should not be able to use this path')
  })

  describe('DELETE /api/v1/users', () => {
    it.skip('Admin should be able to delete all users')
    it.skip('Non-admin users should not be able to use this path')
    it.skip('Public should not be able to use this path')
  })

  describe('GET /api/v1/users/{userid}', () => {
    it.skip('Admin should be able to see any users info')
    it.skip('User should only be able to see their own user info')
    it.skip('Public should not be able to see any user info')
  })

  describe('PUT /api/v1/users/{userid}', () => {
    it.skip('Admin should be able update any user')
    it.skip('Logged in should only be able to update their username, email, name and password')
    it.skip('Public should not be able to use this path')
  })

  describe('DELETE /api/v1/users/{userid}', () => {
    it.skip('Admin should be able to see all users')
    it.skip('Non-admin users should not be able to use this path')
    it.skip('Public should not be able to use this path')
  })
})