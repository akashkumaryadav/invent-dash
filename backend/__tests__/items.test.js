const request = require('supertest');
const { app, server, start } = require('../src/index');
const store = require('../src/store/itemsStore');

const TOKEN = 'test-token';

let httpServer;

beforeAll(async () => {
  httpServer = await start();
});

afterAll(async () => {
  await new Promise((resolve) => httpServer.close(resolve));
});

beforeEach(() => {
  store.clear();
});

test('rejects unauthorized access', async () => {
  const res = await request(app).get('/items');
  expect(res.status).toBe(401);
});

test('creates and lists items', async () => {
  const createRes = await request(app)
    .post('/items')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send({ name: 'Widget', quantity: 5, category: 'A' });
  expect(createRes.status).toBe(201);
  expect(createRes.body.name).toBe('Widget');

  const listRes = await request(app)
    .get('/items')
    .set('Authorization', `Bearer ${TOKEN}`);
  expect(listRes.status).toBe(200);
  expect(listRes.body.length).toBe(1);
});

test('updates and deletes item', async () => {
  const createRes = await request(app)
    .post('/items')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send({ name: 'Gadget', quantity: 2, category: 'B' });
  const id = createRes.body.id;

  const updateRes = await request(app)
    .put(`/items/${id}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send({ quantity: 10 });
  expect(updateRes.status).toBe(200);
  expect(updateRes.body.quantity).toBe(10);

  const delRes = await request(app)
    .delete(`/items/${id}`)
    .set('Authorization', `Bearer ${TOKEN}`);
  expect(delRes.status).toBe(204);
});
