"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TripAutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripAutomationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TripAutomationService = TripAutomationService_1 = class TripAutomationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TripAutomationService_1.name);
    }
    async generateDailyTrips() {
        this.logger.log('Starting daily trip generation...');
        try {
            const today = new Date();
            const dayOfWeek = this.getDayOfWeek(today);
            this.logger.log(`Generating trips for ${dayOfWeek}`);
            const scheduledRoutes = await this.prisma.scheduledRoute.findMany({
                where: {
                    status: client_1.ScheduleStatus.ACTIVE,
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
                }
                catch (error) {
                    this.logger.error(`Failed to create trip for schedule ${schedule.id}: ${error.message}`, error.stack);
                }
            }
            this.logger.log('Daily trip generation completed');
        }
        catch (error) {
            this.logger.error(`Error in daily trip generation: ${error.message}`, error.stack);
        }
    }
    async createTripFromSchedule(schedule, date) {
        const [hours, minutes] = schedule.scheduledTime.split(':');
        const startTime = new Date(date);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        this.logger.log(`Creating trip for route ${schedule.route.name} at ${schedule.scheduledTime}`);
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
        if (schedule.autoAssignChildren) {
            await this.assignChildrenToTrip(trip.id, schedule.routeId, schedule.route.schoolId);
        }
        return trip;
    }
    async assignChildrenToTrip(tripId, routeId, schoolId) {
        try {
            const children = await this.prisma.child.findMany({
                where: { schoolId },
            });
            this.logger.log(`Found ${children.length} children at school for trip ${tripId}`);
            const route = await this.prisma.route.findUnique({
                where: { id: routeId },
                include: { stops: true },
            });
            if (!route || route.stops.length === 0) {
                this.logger.warn(`Route ${routeId} has no stops, skipping child assignment`);
                return;
            }
            const childrenToAssign = children.filter((child) => this.shouldChildBeOnRoute(child, route.stops));
            this.logger.log(`Assigning ${childrenToAssign.length} children to trip ${tripId}`);
            for (const child of childrenToAssign) {
                await this.prisma.childAttendance.create({
                    data: {
                        childId: child.id,
                        tripId,
                        status: 'PICKED_UP',
                        recordedBy: route.stops[0]?.id || 'system',
                    },
                });
            }
            this.logger.log(`Successfully assigned children to trip ${tripId}`);
        }
        catch (error) {
            this.logger.error(`Error assigning children to trip ${tripId}: ${error.message}`);
            throw error;
        }
    }
    shouldChildBeOnRoute(child, stops) {
        if (!child.pickupLatitude || !child.pickupLongitude) {
            return false;
        }
        const DISTANCE_THRESHOLD = 0.05;
        return stops.some((stop) => {
            const latDiff = Math.abs(child.pickupLatitude - stop.latitude);
            const lonDiff = Math.abs(child.pickupLongitude - stop.longitude);
            return latDiff < DISTANCE_THRESHOLD && lonDiff < DISTANCE_THRESHOLD;
        });
    }
    getDayOfWeek(date) {
        const days = [
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
    async generateTripsManually() {
        this.logger.log('Manual trip generation triggered');
        await this.generateDailyTrips();
    }
};
exports.TripAutomationService = TripAutomationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TripAutomationService.prototype, "generateDailyTrips", null);
exports.TripAutomationService = TripAutomationService = TripAutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripAutomationService);
//# sourceMappingURL=trip-automation.service.js.map