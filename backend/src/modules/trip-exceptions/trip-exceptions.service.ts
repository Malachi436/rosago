import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TripExceptionsService {
  constructor(private prisma: PrismaService) {}

  // Skip a trip (create or update exception)
  async skipTrip(childId: string, tripId: string, reason?: string): Promise<any> {
    return this.prisma.tripException.upsert({
      where: { childId_tripId: { childId, tripId } },
      update: {
        reason,
        status: 'ACTIVE',
        requestedAt: new Date(),
      },
      create: {
        childId,
        tripId,
        date: new Date(),
        type: 'SKIP_TRIP',
        reason,
        status: 'ACTIVE',
      },
    });
  }

  // Cancel a skip
  async cancelSkipTrip(childId: string, tripId: string): Promise<any> {
    return this.prisma.tripException.update({
      where: { childId_tripId: { childId, tripId } },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  // Get all active exceptions for a trip
  async getTripExceptions(tripId: string): Promise<any[]> {
    return this.prisma.tripException.findMany({
      where: {
        tripId,
        status: 'ACTIVE',
      },
      include: {
        child: true,
      },
    });
  }

  // Get exception history for a child
  async getChildExceptions(childId: string): Promise<any[]> {
    return this.prisma.tripException.findMany({
      where: { childId },
      include: {
        trip: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // Filter exceptions by specific date
  async getExceptionsByDate(date: Date): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.tripException.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'ACTIVE',
      },
      include: {
        child: true,
        trip: true,
      },
    });
  }
}
