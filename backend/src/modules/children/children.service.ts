import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Child } from '@prisma/client';

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Child | null> {
    return this.prisma.child.findUnique({
      where: { id },
    });
  }

  async findByParentId(parentId: string): Promise<Child[]> {
    return this.prisma.child.findMany({
      where: { parentId },
    });
  }

  async findBySchoolId(schoolId: string): Promise<Child[]> {
    return this.prisma.child.findMany({
      where: { schoolId },
    });
  }

  async create(data: any): Promise<Child> {
    return this.prisma.child.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<Child> {
    return this.prisma.child.update({
      where: { id },
      data,
    });
  }

  async findAll(): Promise<Child[]> {
    return this.prisma.child.findMany();
  }

  async remove(id: string): Promise<Child> {
    return this.prisma.child.delete({
      where: { id },
    });
  }

  async getTrackingData(childId: string, tripId?: string): Promise<any> {
    const child = await this.prisma.child.findUnique({
      where: { id: childId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
            address: true,
          },
        },
      },
    });

    if (!child) {
      throw new Error('Child not found');
    }

    // Get current trip if not provided
    let currentTrip = null;
    if (tripId) {
      currentTrip = await this.prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          bus: {
            select: {
              id: true,
              plateNumber: true,
            },
          },
          route: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } else {
      // Find today's trip for this child
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      currentTrip = await this.prisma.trip.findFirst({
        where: {
          attendances: {
            some: { childId },
          },
          startTime: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          bus: {
            select: {
              id: true,
              plateNumber: true,
            },
          },
          route: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    // Get attendance status
    let attendanceStatus = 'PENDING';
    if (currentTrip) {
      const attendance = await this.prisma.childAttendance.findUnique({
        where: { childId_tripId: { childId, tripId: currentTrip.id } },
      });
      if (attendance) {
        attendanceStatus = attendance.status;
      }
    }

    return {
      child: {
        id: child.id,
        name: `${child.firstName} ${child.lastName}`,
        colorCode: child.colorCode,
      },
      home: {
        latitude: child.homeLatitude,
        longitude: child.homeLongitude,
        address: child.homeAddress,
      },
      school: {
        id: child.school.id,
        name: child.school.name,
        latitude: child.school.latitude,
        longitude: child.school.longitude,
        address: child.school.address,
      },
      currentTrip: currentTrip ? {
        id: currentTrip.id,
        status: currentTrip.status,
        busId: currentTrip.bus.id,
        busPlateNumber: currentTrip.bus.plateNumber,
        routeName: currentTrip.route.name,
      } : null,
      attendanceStatus,
    };
  }
}