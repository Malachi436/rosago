import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return tokens for valid platform admin credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'platform@saferide.com',
          password: 'Test@1234',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.role).toBe('PLATFORM_ADMIN');
    });

    it('should return tokens for valid company admin credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@saferide.com',
          password: 'Test@1234',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.role).toBe('COMPANY_ADMIN');
    });

    it('should return tokens for valid driver credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'driver@saferide.com',
          password: 'Test@1234',
        })
        .expect(200);

      expect(res.body.user.role).toBe('DRIVER');
    });

    it('should return tokens for valid parent credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'parent@test.com',
          password: 'Test@1234',
        })
        .expect(200);

      expect(res.body.user.role).toBe('PARENT');
    });

    it('should reject invalid password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'platform@saferide.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should reject non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test@1234',
        })
        .expect(401);
    });

    it('should reject missing credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('POST /auth/signup', () => {
    const testEmail = `newparent${Date.now()}@test.com`;

    afterEach(async () => {
      // Clean up test user
      await prisma.user.deleteMany({
        where: { email: testEmail },
      });
    });

    it('should create new parent account', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: 'Test@1234',
          firstName: 'New',
          lastName: 'Parent',
        })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe('PARENT');
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: 'Test@1234',
          firstName: 'First',
          lastName: 'User',
        })
        .expect(201);

      // Try to create second user with same email
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: 'Test@1234',
          firstName: 'Second',
          lastName: 'User',
        })
        .expect(409);
    });

    it('should reject weak password', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: '123',
          firstName: 'Test',
          lastName: 'User',
        });
      
      // Should fail with 400 Bad Request due to validation
      expect([400, 409]).toContain(res.status);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'Test@1234',
          firstName: 'Test',
          lastName: 'User',
        });
      
      // Should fail with 400 Bad Request due to email validation
      expect([400, 409]).toContain(res.status);
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'parent@test.com',
          password: 'Test@1234',
        });
      refreshToken = res.body.refresh_token;
    });

    it('should return new access token with valid refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body.access_token).toBeTruthy();
    });

    it('should reject invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'parent@test.com',
          password: 'Test@1234',
        });
      accessToken = res.body.access_token;
    });

    it('should logout successfully with valid token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should reject logout without token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'parent@test.com' })
        .expect(200);

      expect(res.body).toHaveProperty('message');
    });

    it('should not reveal if email does not exist (security)', async () => {
      // Should still return 200 to not leak user existence
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@test.com' })
        .expect(200);
    });
  });

  describe('Role-Based Access', () => {
    let parentToken: string;
    let driverToken: string;
    let companyAdminToken: string;
    let platformAdminToken: string;

    beforeAll(async () => {
      // Get tokens for different roles
      const parentRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'parent@test.com', password: 'Test@1234' });
      parentToken = parentRes.body.accessToken;

      const driverRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'driver@saferide.com', password: 'Test@1234' });
      driverToken = driverRes.body.accessToken;

      const companyRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@saferide.com', password: 'Test@1234' });
      companyAdminToken = companyRes.body.accessToken;

      const platformRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'platform@saferide.com', password: 'Test@1234' });
      platformAdminToken = platformRes.body.accessToken;
    });

    it('parent should not access driver endpoints', async () => {
      const driver = await prisma.driver.findFirst();
      if (driver) {
        await request(app.getHttpServer())
          .get(`/drivers/${driver.id}/today-trip`)
          .set('Authorization', `Bearer ${parentToken}`)
          .expect(403);
      }
    });

    it('driver should not access admin endpoints', async () => {
      const company = await prisma.company.findFirst();
      if (company) {
        await request(app.getHttpServer())
          .get(`/companies/${company.id}`)
          .set('Authorization', `Bearer ${driverToken}`)
          .expect(403);
      }
    });

    it('platform admin should access all companies', async () => {
      const res = await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('company admin should only access their own company', async () => {
      // Get user's company
      const user = await prisma.user.findUnique({
        where: { email: 'admin@saferide.com' },
      });

      if (user?.companyId) {
        // Should access own company
        await request(app.getHttpServer())
          .get(`/companies/${user.companyId}`)
          .set('Authorization', `Bearer ${companyAdminToken}`)
          .expect(200);

        // Should NOT access other companies
        const otherCompany = await prisma.company.findFirst({
          where: { id: { not: user.companyId } },
        });

        if (otherCompany) {
          await request(app.getHttpServer())
            .get(`/companies/${otherCompany.id}`)
            .set('Authorization', `Bearer ${companyAdminToken}`)
            .expect(403);
        }
      }
    });
  });
});
