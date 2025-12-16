import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { DayOfWeek, ScheduleStatus } from '@prisma/client';

@Injectable()
export class TripAutomationService {
  private readonly logger = new Logger(TripAutomationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Runs every day at 2:00 AM to create trips for the day
   * This gives enough time after midnight for any late-night updates
   * and ensures trips are ready when drivers start their morning routine
   */
  @Cron('0 2 * * *') // Every day at 2:00 AM
  async generateDailyTrips() {
    this.logger.log('Starting daily trip generation...');

    try {
      const today = new Date();
      const dayOfWeek = this.getDayOfWeek(today);

      this.logger.log(`Generating trips for ${dayOfWeek}`);

      // Get all active scheduled routes for today
      const scheduledRoutes = await this.prisma.scheduledRoute.findMany({
        where: {
          status: ScheduleStatus.ACTIVE,
          recurringDays: { has: dayOfWeek },
          OR: [
            { effectiveFrom: null, effectiveUntil: null },
            { effectiveFrom: { lte: today }, effectiveUntil: null },
            { effectiveFrom: null, effectiveUntil: { gte: today } },
            { effectiveFrom: { lte: today }, effectiveUntil: { gte: today } },
          ],
        },
        include: {
          route: { include: { stops: true, school: true } },
          driver: true,
          bus: true,
        },
      });

      this.logger.log(`Found ${scheduledRoutes.length} scheduled routes for today`);

      for (const schedule of scheduledRoutes) {
        try {
          await this.createTripFromSchedule(schedule, today);
        } catch (error) {
          this.logger.error(
            `Failed to create trip for schedule ${schedule.id}: ${error.message}`,
            error.stack,
          );
        }
      }

      this.logger.log('Daily trip generation completed');
    } catch (error) {
      this.logger.error(`Error in daily trip generation: ${error.message}`, error.stack);
    }
  }

  /**
   * Create a trip from a scheduled route
   */
  private async createTripFromSchedule(schedule: any, date: Date) {
    const [hours, minutes] = schedule.scheduledTime.split(':');
    const startTime = new Date(date);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    this.logger.log(`Creating trip for route ${schedule.route.name} at ${schedule.scheduledTime}`);

    // Create the trip
    const trip = await this.prisma.trip.create({
      data: {
        busId: schedule.busId,
        routeId: schedule.routeId,
        driverId: schedule.driverId,
        status: 'SCHEDULED',
        startTime,
      },
    });

    this.logger.log(`Created trip ${trip.id} for route ${schedule.route.name}`);

    // Auto-assign children if enabled
    if (schedule.autoAssignChildren) {
      await this.assignChildrenToTrip(trip.id, schedule.routeId, schedule.route.schoolId);
    }

    return trip;
  }

  /**
   * Automatically assign children to a trip based on their school and pickup location
   */
  private async assignChildrenToTrip(tripId: string, routeId: string, schoolId: string) {
    try {
      // Get all children at this school
      const children = await this.prisma.child.findMany({
        where: { schoolId },
      });

      this.logger.log(`Found ${children.length} children at school for trip ${tripId}`);

      // Get route stops to match children
      const route = await this.prisma.route.findUnique({
        where: { id: routeId },
        include: { stops: true },
      });

      if (!route || route.stops.length === 0) {
        this.logger.warn(`Route ${routeId} has no stops, skipping child assignment`);
        return;
      }

      // For each child, check if they should be on this route
      const childrenToAssign = children.filter((child) =>
        this.shouldChildBeOnRoute(child, route.stops),
      );

      this.logger.log(`Assigning ${childrenToAssign.length} children to trip ${tripId}`);

      // Create attendance records for matched children
      for (const child of childrenToAssign) {
        await this.prisma.childAttendance.create({
          data: {
            childId: child.id,
            tripId,
            status: 'PICKED_UP', // Default status, driver will update
            recordedBy: route.stops[0]?.id || 'system', // System assignment
          },
        });
      }

      this.logger.log(`Successfully assigned children to trip ${tripId}`);
    } catch (error) {
      this.logger.error(`Error assigning children to trip ${tripId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if a child should be on this route based on their pickup location
   * This is a simplified version - in production, use more sophisticated geo-matching
   */
  private shouldChildBeOnRoute(child: any, stops: any[]): boolean {
    // If child has no pickup location, don't assign
    if (!child.pickupLatitude || !child.pickupLongitude) {
      return false;
    }

    // Check if child's pickup location is within reasonable distance of any stop
    // This is a simple implementation - in production, use proper geospatial queries
    const DISTANCE_THRESHOLD = 0.05; // ~5km radius (rough approximation)

    return stops.some((stop) => {
      const latDiff = Math.abs(child.pickupLatitude - stop.latitude);
      const lonDiff = Math.abs(child.pickupLongitude - stop.longitude);
      return latDiff < DISTANCE_THRESHOLD && lonDiff < DISTANCE_THRESHOLD;
    });
  }

  /**
   * Get day of week as enum
   */
  private getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    return days[date.getDay()];
  }

  /**
   * Manual trigger for testing (can be called via endpoint)
   */
  async generateTripsManually() {
    this.logger.log('Manual trip generation triggered');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if trips already exist for today
    const existingTrips = await this.prisma.trip.findMany({
      where: {
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 1,
    });

    if (existingTrips.length > 0) {
      const firstTrip = existingTrips[0];
      const createdAt = firstTrip.createdAt;
      const createdHour = createdAt.getHours();
      
      // Check if trips were auto-generated (at 2:00 AM)
      const wasAutoGenerated = createdHour === 2;
      
      if (wasAutoGenerated) {
        return {
          success: false,
          message: 'Trips have already been automatically generated for today at 2:00 AM.',
          generatedAt: createdAt.toISOString(),
          generationType: 'automatic',
          existingTripsCount: await this.prisma.trip.count({
            where: {
              startTime: { gte: today, lt: tomorrow },
            },
          }),
        };
      } else {
        return {
          success: false,
          message: `Trips have already been manually generated for today at ${createdAt.toLocaleTimeString()}.`,
          generatedAt: createdAt.toISOString(),
          generationType: 'manual',
          existingTripsCount: await this.prisma.trip.count({
            where: {
              startTime: { gte: today, lt: tomorrow },
            },
          }),
        };
      }
    }

    // No existing trips, proceed with generation
    await this.generateDailyTrips();
    
    const newTripsCount = await this.prisma.trip.count({
      where: {
        startTime: { gte: today, lt: tomorrow },
      },
    });

    return {
      success: true,
      message: `Successfully generated ${newTripsCount} trip(s) for today.`,
      generatedAt: new Date().toISOString(),
      generationType: 'manual',
      tripsCreated: newTripsCount,
    };
  }
}
