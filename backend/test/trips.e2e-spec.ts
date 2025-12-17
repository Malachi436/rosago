import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Trips (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let companyId: string;
  let schoolId: string;
  let routeId: string;
  let busId: string;
  let driverId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Login as company admin to get auth token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@saferide.com',
        password: 'Test@1234',
      });

    authToken = loginRes.body.accessToken;

    // Get company ID from user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@saferide.com' },
    });
    companyId = user?.companyId || '';

    // Get or create test data
    const school = await prisma.school.findFirst({
      where: { companyId },
    });
    schoolId = school?.id || '';

    const bus = await prisma.bus.findFirst({
      where: { companyId },
    });
    busId = bus?.id || '';

    const driver = await prisma.driver.findFirst({
      include: { user: true },
    });
    driverId = driver?.id || '';

    const route = await prisma.route.findFirst({
      where: { schoolId },
    });
    routeId = route?.id || '';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Trip Generation', () => {
    it('should generate trips for today when none exist', async () => {
      // First, clean up any existing trips for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      await prisma.trip.deleteMany({
        where: {
          startTime: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      const res = await request(app.getHttpServer())
        .post('/trips/generate-manual')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(res.body).toHaveProperty('success');
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('tripsCreated');
    });

    it('should prevent duplicate trip generation for same day', async () => {
      // Try to generate trips again
      const res = await request(app.getHttpServer())
        .post('/trips/generate-today')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already');
    });

    it('should return information about when trips were generated', async () => {
      const res = await request(app.getHttpServer())
        .post('/trips/generate-today')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(res.body).toHaveProperty('generatedAt');
      expect(res.body).toHaveProperty('generationType');
    });
  });

  describe('Active Trips by Company', () => {
    it('should return active trips for company admin', async () => {
      const res = await request(app.getHttpServer())
        .get(`/trips/company/${companyId}/active`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('status');
        expect(res.body[0]).toHaveProperty('bus');
        expect(res.body[0]).toHaveProperty('route');
      }
    });

    it('should not return trips from other companies', async () => {
      const res = await request(app.getHttpServer())
        .get(`/trips/company/${companyId}/active`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // All trips should belong to this company
      for (const trip of res.body) {
        if (trip.driver?.user) {
          expect(trip.driver.user.companyId).toBe(companyId);
        }
      }
    });
  });

  describe('Trip Status Transitions', () => {
    let testTripId: string;

    beforeEach(async () => {
      // Create a test trip
      const trip = await prisma.trip.create({
        data: {
          busId,
          routeId,
          driverId,
          status: 'SCHEDULED',
          startTime: new Date(),
        },
      });
      testTripId = trip.id;
    });

    afterEach(async () => {
      // Clean up
      await prisma.trip.delete({
        where: { id: testTripId },
      });
    });

    it('should transition trip from SCHEDULED to IN_PROGRESS', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/trips/${testTripId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'IN_PROGRESS' })
        .expect(200);

      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('should transition trip to COMPLETED', async () => {
      // First set to IN_PROGRESS
      await prisma.trip.update({
        where: { id: testTripId },
        data: { status: 'IN_PROGRESS' },
      });

      const res = await request(app.getHttpServer())
        .patch(`/trips/${testTripId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'COMPLETED' })
        .expect(200);

      expect(res.body.status).toBe('COMPLETED');
      expect(res.body.endTime).toBeTruthy();
    });
  });
});
