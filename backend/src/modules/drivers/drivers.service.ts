import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Driver } from '@prisma/client';

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
    return this.prisma.driver.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<Driver> {
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }

  async findAll(): Promise<Driver[]> {
    return this.prisma.driver.findMany();
  }

  async remove(id: string): Promise<Driver> {
    return this.prisma.driver.delete({
      where: { id },
    });
  }
}