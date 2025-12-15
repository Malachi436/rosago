import { PrismaService } from '../../prisma/prisma.service';
import { DayOfWeek, ScheduleStatus } from '@prisma/client';
export declare class ScheduledRoutesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        routeId: string;
        driverId: string;
        busId: string;
        scheduledTime: string;
        recurringDays: DayOfWeek[];
        effectiveFrom?: Date;
        effectiveUntil?: Date;
    }): Promise<{
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    }>;
    findAll(): Promise<({
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    }>;
    findActiveForDay(dayOfWeek: DayOfWeek): Promise<({
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    })[]>;
    update(id: string, data: Partial<{
        routeId: string;
        driverId: string;
        busId: string;
        scheduledTime: string;
        recurringDays: DayOfWeek[];
        status: ScheduleStatus;
        effectiveFrom: Date;
        effectiveUntil: Date;
    }>): Promise<{
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    }>;
    suspend(id: string): Promise<{
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    }>;
    activate(id: string): Promise<{
        bus: {
            id: string;
            plateNumber: string;
            capacity: number;
            companyId: string | null;
            driverId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            user: {
                id: string;
                companyId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                refreshToken: string | null;
                schoolId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            license: string;
            userId: string;
        };
        route: {
            school: {
                name: string;
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            };
            stops: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                latitude: number;
                longitude: number;
                order: number;
                routeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            shift: string | null;
            busId: string | null;
        };
    } & {
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        busId: string;
        routeId: string;
        scheduledTime: string;
        recurringDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.ScheduleStatus;
        autoAssignChildren: boolean;
        effectiveFrom: Date | null;
        effectiveUntil: Date | null;
    }>;
}
