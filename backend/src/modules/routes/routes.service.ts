import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Route } from '@prisma/client';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Route | null> {
    return this.prisma.route.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findBySchoolId(schoolId: string): Promise<Route[]> {
    return this.prisma.route.findMany({
      where: { schoolId },
      include: {
        stops: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async create(data: any): Promise<Route> {
    return this.prisma.route.create({
      data,
      include: {
        stops: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async update(id: string, data: any): Promise<Route> {
    return this.prisma.route.update({
      where: { id },
      data,
      include: {
        stops: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findAll(): Promise<Route[]> {
    return this.prisma.route.findMany({
      include: {
        stops: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Route> {
    return this.prisma.route.delete({
      where: { id },
    });
  }
}