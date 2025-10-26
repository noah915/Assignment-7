const request = require('supertest');
const app = require('../server');

describe('Backend API', () => {
  test('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('port');
  });

  test('GET /api/recipes returns an array', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/recipes creates a recipe and returns it', async () => {
    const newRecipe = {
      name: 'Test Pancakes',
      ingredients: 'Flour\nEggs\nMilk',
      instructions: 'Mix and cook',
      cookTime: '15 minutes'
    };

    const postRes = await request(app)
      .post('/api/recipes')
      .send(newRecipe)
      .set('Accept', 'application/json');

    expect([201,200]).toContain(postRes.statusCode);
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body).toMatchObject({
      name: newRecipe.name,
      cookTime: newRecipe.cookTime
    });

    // cleanup: delete the created recipe
    if (postRes.body && postRes.body.id) {
      await request(app).delete(`/api/recipes/${postRes.body.id}`);
    }
  }, 10000);
});
