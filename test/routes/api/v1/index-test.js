const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');

describe('/api/v1/', function() {
  describe('GET /api/v1/', function() {
    it('returns response OK', function() {
      return request(app)
        .get('/api/v1')
        .expect(204)
    });
  });
});