import { PrismaService } from '../../prisma/prisma.service';
export declare class TripAutomationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateDailyTrips(): Promise<void>;
    private createTripFromSchedule;
    private assignChildrenToTrip;
    private shouldChildBeOnRoute;
    private getDayOfWeek;
    generateTripsManually(): Promise<void>;
}
