import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Redis } from 'ioredis';

@Injectable()
export class AnalyticsService {
  private readonly redis: Redis;

  constructor(private prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async getRoutePerformance(routeId: string): Promise<any> {
    const cacheKey = `analytics:route:${routeId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // Calculate route performance metrics
    const trips = await this.prisma.trip.findMany({
      where: { routeId },
      include: {
        histories: true,
      },
    });

    const metrics = {
      totalTrips: trips.length,
      onTimeTrips: trips.filter(trip => this.isTripOnTime(trip)).length,
      avgDuration: this.calculateAverageDuration(trips),
      completionRate: trips.length > 0 ? trips.filter(t => t.status === 'COMPLETED').length / trips.length : 0,
    };

    // Cache for 1 hour
    await this.redis.setex(cacheKey, 3600, JSON.stringify(metrics));
    
    return metrics;
  }

  async getMissedPickups(): Promise<any> {
    const cacheKey = 'analytics:missed_pickups';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const missedPickups = await this.prisma.childAttendance.count({
      where: {
        status: 'MISSED',
      },
    });

    // Cache for 30 minutes
    await this.redis.setex(cacheKey, 1800, JSON.stringify({ count: missedPickups }));
    
    return { count: missedPickups };
  }

  async getTripSuccessRate(): Promise<any> {
    const cacheKey = 'analytics:trip_success_rate';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const totalTrips = await this.prisma.trip.count();
    const completedTrips = await this.prisma.trip.count({
      where: {
        status: 'COMPLETED',
      },
    });

    const successRate = totalTrips > 0 ? completedTrips / totalTrips : 0;
    
    const metrics = {
      totalTrips,
      completedTrips,
      successRate,
    };

    // Cache for 1 hour
    await this.redis.setex(cacheKey, 3600, JSON.stringify(metrics));
    
    return metrics;
  }

  async getPaymentCompletionRate(): Promise<any> {
    const cacheKey = 'analytics:payment_completion_rate';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const totalPayments = await this.prisma.paymentIntent.count();
    const successfulPayments = await this.prisma.paymentIntent.count({
      where: {
        status: 'succeeded',
      },
    });

    const completionRate = totalPayments > 0 ? successfulPayments / totalPayments : 0;
    
    const metrics = {
      totalPayments,
      successfulPayments,
      completionRate,
    };

    // Cache for 1 hour
    await this.redis.setex(cacheKey, 3600, JSON.stringify(metrics));
    
    return metrics;
  }

  private isTripOnTime(trip: any): boolean {
    // Simplified on-time logic - in a real implementation, you would compare actual vs scheduled times
    return trip.status === 'COMPLETED' && trip.endTime && trip.startTime && 
           (new Date(trip.endTime).getTime() - new Date(trip.startTime).getTime()) < 3600000; // 1 hour
  }

  private calculateAverageDuration(trips: any[]): number {
    if (trips.length === 0) return 0;
    
    const durations = trips
      .filter(trip => trip.startTime && trip.endTime)
      .map(trip => new Date(trip.endTime).getTime() - new Date(trip.startTime).getTime());
    
    if (durations.length === 0) return 0;
    
    const sum = durations.reduce((acc, duration) => acc + duration, 0);
    return sum / durations.length;
  }
}