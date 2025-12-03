import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Driver } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Driver | null> {
    return this.prisma.driver.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    return this.prisma.driver.findUnique({
      where: { userId },
    });
  }

  async findByLicense(license: string): Promise<Driver | null> {
    return this.prisma.driver.findUnique({
      where: { license },
    });
  }

  async create(data: any): Promise<Driver> {
    // Extract user fields from data
    const { firstName, lastName, email, phone, password, license, companyId, schoolId } = data;

    // Check if driver with this license already exists
    const existingDriver = await this.findByLicense(license);
    if (existingDriver) {
      throw new BadRequestException('Driver with this license already exists');
    }

    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and driver in transaction
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          passwordHash,
          role: 'DRIVER',
          companyId,
          schoolId,
        },
      });

      const driver = await tx.driver.create({
        data: {
          license,
          userId: user.id,
        },
      });

      return driver;
    });
  }

  async update(id: string, data: any): Promise<Driver> {
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.driver.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        buses: true,
      },
    });
  }

  async remove(id: string): Promise<Driver> {
    const driver = await this.findOne(id);
    if (!driver) {
      throw new BadRequestException('Driver not found');
    }

    // Delete driver and user in transaction
    return this.prisma.$transaction(async (tx) => {
      // Delete driver first
      const deletedDriver = await tx.driver.delete({
        where: { id },
      });

      // Delete associated user
      await tx.user.delete({
        where: { id: driver.userId },
      });

      return deletedDriver;
    });
  }

  async getTodayTrip(driverId: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.trip.findFirst({
      where: {
        driverId,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        bus: {
          include: {
            locations: true,
          },
        },
        route: {
          include: {
            stops: true,
          },
        },
        attendances: {
          include: {
            child: true,
          },
        },
      },
    });
  }
}