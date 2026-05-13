const request = require('supertest');
const { app, db, hashSenha } = require('../server');

afterAll((done) => {
  db.close(done);
});

describe('backend helpers', () => {
  test('gera hash sha256 da senha', () => {
    expect(hashSenha('123456')).toBe(
      '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
    );
  });
});

describe('POST /api/login', () => {
  test('retorna 400 quando usuario ou senha nao sao enviados', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ usuario: 'admin' });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      sucesso: false,
      mensagem: 'Usuario e senha sao obrigatorios'
    });
  });
});
