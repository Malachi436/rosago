import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Children & Attendance (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyAuthToken: string;
  let driverAuthToken: string;
  let parentAuthToken: string;
  let companyId: string;
  let schoolId: string;
  let routeId: string;
  let childId: string;
  let tripId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Login as company admin
    const companyLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@saferide.com',
        password: 'Test@1234',
      });
    companyAuthToken = companyLogin.body.accessToken;

    // Login as driver
    const driverLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'driver@saferide.com',
        password: 'Test@1234',
      });
    driverAuthToken = driverLogin.body.accessToken;

    // Login as parent
    const parentLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'parent@test.com',
        password: 'Test@1234',
      });
    parentAuthToken = parentLogin.body.accessToken;

    // Get test data
    const user = await prisma.user.findUnique({
      where: { email: 'admin@saferide.com' },
    });
    companyId = user?.companyId || '';

    const school = await prisma.school.findFirst({
      where: { companyId },
    });
    schoolId = school?.id || '';

    const route = await prisma.route.findFirst({
      where: { schoolId },
    });
    routeId = route?.id || '';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Child Route Assignment & Auto-Sync', () => {
    beforeEach(async () => {
      // Create a test child without route
      const child = await prisma.child.create({
        data: {
          firstName: 'Test',
          lastName: 'Child',
          dateOfBirth: new Date('2010-01-01'),
          schoolId,
          uniqueCode: `TEST${Date.now()}`,
          isClaimed: false,
        },
      });
      childId = child.id;

      // Create a trip for today
      const today = new Date();
      today.setHours(7, 0, 0, 0);
      const trip = await prisma.trip.create({
        data: {
          routeId,
          busId: (await prisma.bus.findFirst({ where: { companyId } }))?.id || '',
          driverId: (await prisma.driver.findFirst())?.id || '',
          status: 'SCHEDULED',
          startTime: today,
        },
      });
      tripId = trip.id;
    });

    afterEach(async () => {
      // Clean up
      await prisma.childAttendance.deleteMany({
        where: { childId },
      });
      await prisma.child.delete({
        where: { id: childId },
      });
      await prisma.trip.delete({
        where: { id: tripId },
      });
    });

    it('should auto-assign child to today\'s trips when route is assigned', async () => {
      // Assign child to route
      await request(app.getHttpServer())
        .patch(`/children/${childId}`)
        .set('Authorization', `Bearer ${companyAuthToken}`)
        .send({ routeId })
        .expect(200);

      // Check if attendance was created
      const attendance = await prisma.childAttendance.findUnique({
        where: {
          childId_tripId: {
            childId,
            tripId,
          },
        },
      });

      expect(attendance).toBeTruthy();
      expect(attendance?.status).toBe('PENDING');
    });

    it('should not create duplicate attendance if already exists', async () => {
      // Assign child to route first time
      await request(app.getHttpServer())
        .patch(`/children/${childId}`)
        .set('Authorization', `Bearer ${companyAuthToken}`)
        .send({ routeId })
        .expect(200);

      // Count attendances
      const count1 = await prisma.childAttendance.count({
        where: { childId },
      });

      // Try to assign same route again (should be idempotent)
      await request(app.getHttpServer())
        .patch(`/children/${childId}`)
        .set('Authorization', `Bearer ${companyAuthToken}`)
        .send({ routeId })
        .expect(200);

      // Count should remain the same
      const count2 = await prisma.childAttendance.count({
        where: { childId },
      });

      expect(count2).toBe(count1);
    });
  });

  describe('Attendance Management', () => {
    let attendanceId: string;

    beforeEach(async () => {
      // Create test child
      const child = await prisma.child.create({
        data: {
          firstName: 'Test',
          lastName: 'Attendance',
          dateOfBirth: new Date('2010-01-01'),
          schoolId,
          routeId,
          uniqueCode: `ATT${Date.now()}`,
        },
      });
      childId = child.id;

      // Create trip
      const trip = await prisma.trip.create({
        data: {
          routeId,
          busId: (await prisma.bus.findFirst({ where: { companyId } }))?.id || '',
          driverId: (await prisma.driver.findFirst())?.id || '',
          status: 'IN_PROGRESS',
          startTime: new Date(),
        },
      });
      tripId = trip.id;

      // Create attendance
      const attendance = await prisma.childAttendance.create({
        data: {
          childId,
          tripId,
          status: 'PENDING',
          recordedBy: 'system',
        },
      });
      attendanceId = attendance.id;
    });

    afterEach(async () => {
      await prisma.childAttendance.deleteMany({
        where: { childId },
      });
      await prisma.trip.delete({
        where: { id: tripId },
      });
      await prisma.child.delete({
        where: { id: childId },
      });
    });

    it('driver should mark child as PICKED_UP', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/attendance/${attendanceId}`)
        .set('Authorization', `Bearer ${driverAuthToken}`)
        .send({ status: 'PICKED_UP' })
        .expect(200);

      expect(res.body.status).toBe('PICKED_UP');
    });

    it('driver should mark child as DROPPED', async () => {
      // First mark as picked up
      await prisma.childAttendance.update({
        where: { id: attendanceId },
        data: { status: 'PICKED_UP' },
      });

      const res = await request(app.getHttpServer())
        .patch(`/attendance/${attendanceId}`)
        .set('Authorization', `Bearer ${driverAuthToken}`)
        .send({ status: 'DROPPED' })
        .expect(200);

      expect(res.body.status).toBe('DROPPED');
    });

    it('driver should be able to revert status', async () => {
      // Mark as picked up
      await prisma.childAttendance.update({
        where: { id: attendanceId },
        data: { status: 'PICKED_UP' },
      });

      // Revert to pending
      const res = await request(app.getHttpServer())
        .patch(`/attendance/${attendanceId}`)
        .set('Authorization', `Bearer ${driverAuthToken}`)
        .send({ status: 'PENDING' })
        .expect(200);

      expect(res.body.status).toBe('PENDING');
    });

    it('parent should NOT be able to update attendance', async () => {
      await request(app.getHttpServer())
        .patch(`/attendance/${attendanceId}`)
        .set('Authorization', `Bearer ${parentAuthToken}`)
        .send({ status: 'PICKED_UP' })
        .expect(403);
    });

    it('should get all attendances for a trip', async () => {
      const res = await request(app.getHttpServer())
        .get(`/attendance/trip/${tripId}`)
        .set('Authorization', `Bearer ${driverAuthToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('child');
      expect(res.body[0]).toHaveProperty('status');
    });
  });

  describe('Child Linking (Parent)', () => {
    let unlinkChildId: string;
    let uniqueCode: string;

    beforeEach(async () => {
      uniqueCode = `LINK${Date.now()}`;
      const child = await prisma.child.create({
        data: {
          firstName: 'Unlinked',
          lastName: 'Child',
          dateOfBirth: new Date('2010-01-01'),
          schoolId,
          uniqueCode,
          isClaimed: false,
        },
      });
      unlinkChildId = child.id;
    });

    afterEach(async () => {
      await prisma.child.delete({
        where: { id: unlinkChildId },
      });
    });

    it('parent should link child with valid unique code', async () => {
      const res = await request(app.getHttpServer())
        .post('/children/link')
        .set('Authorization', `Bearer ${parentAuthToken}`)
        .send({
          uniqueCode,
          homeLatitude: 5.6271637,
          homeLongitude: -0.1011672,
          homeAddress: '123 Test Street',
        })
        .expect(201);

      expect(res.body.isClaimed).toBe(true);
      expect(res.body.homeLatitude).toBe(5.6271637);
      expect(res.body.homeAddress).toBe('123 Test Street');
    });

    it('should reject invalid unique code', async () => {
      await request(app.getHttpServer())
        .post('/children/link')
        .set('Authorization', `Bearer ${parentAuthToken}`)
        .send({
          uniqueCode: 'INVALID123',
          homeLatitude: 5.6271637,
          homeLongitude: -0.1011672,
          homeAddress: '123 Test Street',
        })
        .expect(404);
    });

    it('should reject already claimed child', async () => {
      // Link once
      await request(app.getHttpServer())
        .post('/children/link')
        .set('Authorization', `Bearer ${parentAuthToken}`)
        .send({
          uniqueCode,
          homeLatitude: 5.6271637,
          homeLongitude: -0.1011672,
          homeAddress: '123 Test Street',
        })
        .expect(201);

      // Try to link again
      await request(app.getHttpServer())
        .post('/children/link')
        .set('Authorization', `Bearer ${parentAuthToken}`)
        .send({
          uniqueCode,
          homeLatitude: 5.6271637,
          homeLongitude: -0.1011672,
          homeAddress: '123 Test Street',
        })
        .expect(400);
    });
  });
});
