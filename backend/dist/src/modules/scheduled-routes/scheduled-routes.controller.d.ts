import { ScheduledRoutesService } from './scheduled-routes.service';
import { DayOfWeek } from '@prisma/client';
export declare class ScheduledRoutesController {
    private readonly scheduledRoutesService;
    constructor(scheduledRoutesService: ScheduledRoutesService);
    create(data: {
        routeId: string;
        driverId: string;
        busId: string;
        scheduledTime: string;
        recurringDays: DayOfWeek[];
        effectiveFrom?: string;
        effectiveUntil?: string;
    }): Promise<{
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    }>;
    findAll(): Promise<({
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    })[]>;
    findByCompany(companyId: string): Promise<({
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    })[]>;
    findToday(): Promise<({
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    })[]>;
    findOne(id: string): Promise<{
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    }>;
    update(id: string, data: any): Promise<{
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    }>;
    suspend(id: string): Promise<{
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    }>;
    activate(id: string): Promise<{
        route: {
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                companyId: string;
                latitude: number | null;
                longitude: number | null;
                address: string | null;
                phone: string | null;
                email: string | null;
            };
            stops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                routeId: string;
                name: string;
                latitude: number;
                longitude: number;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            busId: string | null;
            name: string;
            schoolId: string;
            shift: string | null;
        };
        driver: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string | null;
                companyId: string | null;
                phone: string | null;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        bus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            driverId: string | null;
            companyId: string | null;
            plateNumber: string;
            capacity: number;
        };
    } & {
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        routeId: string;
        driverId: string;
        busId: string;
    }>;
}
