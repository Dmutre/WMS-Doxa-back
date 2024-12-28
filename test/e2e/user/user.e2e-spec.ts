import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

let app: INestApplication;
let token: string;
let createdUserId: string;
let createdRoleId: string;

const testUser = {
  email: process.env.CLI_USER_EMAIL,
  password: process.env.CLI_USER_PASSWORD,
};

const newUser = {
  firstName: 'Test',
  lastName: 'User',
  email: `testuser@${Math.random()}.com`,
  password: 'Test@1234222',
  roleId: '',
};

describe('UserController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    token = authResponse.body.token;

    const permissionResponse = await request(app.getHttpServer())
      .get('/permissions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const roleResponse = await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Role' + Math.random().toString(36).substring(7),
        permissionIds: permissionResponse.body.data.map((p) => p.id),
      })
      .expect(201);

    createdRoleId = roleResponse.body.id;
    newUser.roleId = createdRoleId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);

      createdUserId = response.body.id;
    });
  });

  describe('/users (GET)', () => {
    it('should find a list of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .query({ email: newUser.email, page: 1, pageSize: 10 })
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.data[0].email).toBe(newUser.email);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should find a user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(createdUserId);
      expect(response.body.email).toBe(newUser.email);
    });
  });

  describe('/users/:id/fire (POST)', () => {
    it('should fire a user', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${createdUserId}/fire`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('FIRED');
    });
  });

  describe('/users/:id/restore (POST)', () => {
    it('should restore a fired user', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${createdUserId}/restore`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update a user', async () => {
      const updatedUser = {
        firstName: 'Updated',
        lastName: 'User',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser)
        .expect(200);

      expect(response.body.firstName).toBe(updatedUser.firstName);
      expect(response.body.lastName).toBe(updatedUser.lastName);
    });
  });
});
