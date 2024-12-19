import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

let app: INestApplication;
let token: string;
let warehouseId: string;
let itemId: string;
let createdBatchId: string;

const testUser = {
  email: process.env.CLI_USER_EMAIL,
  password: process.env.CLI_USER_PASSWORD,
};

const testWarehouse = {
  name: 'Test Warehouse' + Math.random(),
  type: 'Test Type',
  address: 'Test Address' + Math.random(),
};

const testItem = {
  name: 'Test Item' + Math.random(),
  sku: 'TEST-SKU-123' + Math.random(),
};

const testBatch = {
  quantity: 10,
};

describe('BatchController (e2e)', () => {
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

    const warehouseResponse = await request(app.getHttpServer())
      .post('/warehouse')
      .set('Authorization', `Bearer ${token}`)
      .send(testWarehouse)
      .expect(201);

    warehouseId = warehouseResponse.body.id;

    const itemResponse = await request(app.getHttpServer())
      .post('/item')
      .set('Authorization', `Bearer ${token}`)
      .send(testItem)
      .expect(201);

    itemId = itemResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/batch (POST)', () => {
    it('should create a new batch', async () => {
      const response = await request(app.getHttpServer())
        .post('/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBatch,
          warehouseId,
          itemId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.quantity).toBe(testBatch.quantity);

      createdBatchId = response.body.id;
    });
  });

  describe('/batch/:id (GET)', () => {
    it('should retrieve a batch by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/batch/${createdBatchId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdBatchId);
      expect(response.body.quantity).toBe(testBatch.quantity);
    });
  });

  describe('/batch/:id (PUT)', () => {
    it('should update a batch by ID', async () => {
      const updatedBatch = {
        quantity: 27,
      };

      const response = await request(app.getHttpServer())
        .put(`/batch/${createdBatchId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBatch)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdBatchId);
      expect(response.body.quantity).toBe(updatedBatch.quantity);
    });
  });

  describe('/batch/:id (DELETE)', () => {
    it('should delete a batch by ID', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/batch/${createdBatchId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe(
        `Batch with id ${createdBatchId} deleted successfully`,
      );
    });
  });

  describe('/batch (GET)', () => {
    it('should retrieve all batches', async () => {
      const response = await request(app.getHttpServer())
        .get('/batch')
        .query({ page: 1, pageSize: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('total');
    });
  });
});
