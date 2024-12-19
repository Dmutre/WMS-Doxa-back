import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

const BASE_URL = '/auth';
let app: INestApplication;
let token: string;
let refreshToken: string; // eslint-disable-line

const testUser = {
  email: process.env.CLI_USER_EMAIL,
  password: process.env.CLI_USER_PASSWORD,
};

describe('AuthController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/login (POST)', () => {
    it('should login the user and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      token = response.body.token;
      refreshToken = response.headers['set-cookie'][0];
    });

    it('should return 401 for invalid credentials', async () => {
      await request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send({ email: 'wrong@example.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('/refresh (POST)', () => {
    it('should return 500 for invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post(`${BASE_URL}/refresh`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', `refreshToken=invalidRefreshToken`)
        .expect(500);
    });
  });

  describe('/change-password (POST)', () => {
    it('should change the user password', async () => {
      await request(app.getHttpServer())
        .post(`${BASE_URL}/change-password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: testUser.password,
          newPassword: 'NewPassword@123',
        })
        .expect(200);

      // Revert to original password for future tests
      await request(app.getHttpServer())
        .post(`${BASE_URL}/change-password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'NewPassword@123',
          newPassword: testUser.password,
        })
        .expect(200);
    });

    it('should return 401 for incorrect old password', async () => {
      await request(app.getHttpServer())
        .post(`${BASE_URL}/change-password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'WrongPassword',
          newPassword: 'AnotherPassword@123',
        })
        .expect(401);
    });
  });

  describe('/me (GET)', () => {
    it('should return the current user details', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUser.email);
    });
  });
});
