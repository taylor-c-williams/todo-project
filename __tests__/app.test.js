require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async() => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
        token = signInData.body.token; // eslint-disable-line
    }, 10000);

  
    afterAll(done => {
      return client.end(done);
    });

    // Post Todo
    test('Posts a todo', async() => {
      const expectation = [{
        id: expect.any(Number),
        todo: 'ride bike',
        completed: false,
        owner_id: expect.any(Number)
      }];

      const newTodo = {
        todo: 'ride bike'
      };
    
      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(data.body).toEqual(expectation);
    });

    // Get all Everyone
    test('returns all todos', async() => {

      const expectation = [
        { 'completed': false, 'id': 1, 'owner_id': 2, 'todo': 'ride bike' }
      ];      
      
      const data = await fakeRequest(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);
      expect(data.body).toEqual(expectation);  
    });
  });  
});
