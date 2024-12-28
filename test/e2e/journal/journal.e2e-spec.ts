import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

let app: INestApplication;
let token: string;

const testUser = {
  email: process.env.CLI_USER_EMAIL,
  password: process.env.CLI_USER_PASSWORD,
};

describe('JournalController (e2e)', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/journal/user-actions (GET)', () => {
    it('should return a list of user actions', async () => {
      const response = await request(app.getHttpServer())
        .get('/journal/user-actions')
        .query({ page: 1, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('total');
    });

    it('should filter user actions by action name', async () => {
      const response = await request(app.getHttpServer())
        .get('/journal/user-actions')
        .query({ action: 'Test Action', page: 1, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it('should return 401 if no token is provided', async () => {
      await request(app.getHttpServer())
        .get('/journal/user-actions')
        .expect(401);
    });
  });
});
