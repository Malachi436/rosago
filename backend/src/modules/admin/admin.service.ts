import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats(): Promise<any> {
    const [
      totalCompanies,
      totalSchools,
      totalUsers,
      totalDrivers,
      totalChildren,
      totalBuses,
      totalRoutes,
      totalTrips,
    ] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.school.count(),
      this.prisma.user.count(),
      this.prisma.driver.count(),
      this.prisma.child.count(),
      this.prisma.bus.count(),
      this.prisma.route.count(),
      this.prisma.trip.count(),
    ]);

    return {
      totalCompanies,
      totalSchools,
      totalUsers,
      totalDrivers,
      totalChildren,
      totalBuses,
      totalRoutes,
      totalTrips,
    };
  }

  async getCompanyStats(companyId: string): Promise<any> {
    const [
      totalSchools,
      totalUsers,
      totalDrivers,
      totalChildren,
      totalBuses,
      totalRoutes,
      totalTrips,
    ] = await Promise.all([
      this.prisma.school.count({ where: { companyId } }),
      this.prisma.user.count({ where: { companyId } }),
      this.prisma.driver.count({ where: { user: { companyId } } }),
      this.prisma.child.count({ where: { school: { companyId } } }),
      this.prisma.bus.count({ where: { driver: { user: { companyId } } } }),
      this.prisma.route.count({ where: { school: { companyId } } }),
      this.prisma.trip.count({ where: { bus: { driver: { user: { companyId } } } } }),
    ]);

    return {
      totalSchools,
      totalUsers,
      totalDrivers,
      totalChildren,
      totalBuses,
      totalRoutes,
      totalTrips,
    };
  }

  async createCompany(data: any): Promise<any> {
    return this.prisma.company.create({ data });
  }

  async createSchool(companyId: string, data: any): Promise<any> {
    return this.prisma.school.create({
      data: {
        ...data,
        companyId,
      },
    });
  }
}