const {expect, assert} = require('chai');
const request = require('supertest');

const app = require('../../../../app');

describe('/api/v1/auth', () => {
  describe('POST /api/v1/auth/register', () => {

    it('returns user information and 201 successfully created response', async () => {

      const newUser = {
        "name":"ben",
        "email":"ben@ben.com",
        "address":"My Address",
        "password":"benspassword",
      };

      await request(app)
        .post('/api/v1/auth/register')
        .type('application/json')
        .send(JSON.stringify(newUser))
        .then((response) => {

          assert.equal(response.status, 201);

          const { id, name, email, address } = response.body;

          assert.equal(name, newUser.name);
          assert.equal(email, newUser.email);
          assert.equal(address, newUser.address);

          expect(Number.isInteger(id)).to.be.true;
        });
    });

    it('returns different user information and 201 successfully created response', async () => {

      const newUser = {
        "name":"liam",
        "email":"liam@liam.com",
        "address":"liam's address",
        "password":"liamspassword",
      };

      await request(app)
        .post('/api/v1/auth/register')
        .type('application/json')
        .send(JSON.stringify(newUser))
        .then((response) => {
          assert.equal(response.status, 201);

          const { id, name, email, address } = response.body;

          assert.equal(name, newUser.name);
          assert.equal(email, newUser.email);
          assert.equal(address, newUser.address);

          expect(Number.isInteger(id)).to.be.true;
        });
    });
  });
});
