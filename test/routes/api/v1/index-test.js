const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');

describe('/api/v1/', () => {
  describe('GET /api/v1/', () => {
    it('returns response OK', () => {
      return request(app)
        .get('/api/v1')
        .expect(204)
    });
  });
});