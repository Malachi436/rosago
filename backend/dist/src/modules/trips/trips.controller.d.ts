import { TripsService } from './trips.service';
import { TripAutomationService } from './trip-automation.service';
export declare class TripsController {
    private readonly tripsService;
    private readonly tripAutomationService;
    constructor(tripsService: TripsService, tripAutomationService: TripAutomationService);
    create(createTripDto: any): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findActiveByChild(childId: string): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateTripDto: any): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    transitionStatus(id: string, statusDto: any): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        busId: string;
        routeId: string;
        driverId: string;
        status: import(".prisma/client").$Enums.TripStatus;
        startTime: Date | null;
        endTime: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateTodayTrips(): Promise<{
        message: string;
    }>;
}
