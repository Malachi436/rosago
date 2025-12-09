import { PrismaService } from '../../prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        checks: {
            database: string;
        };
    }>;
    live(): {
        status: string;
    };
    ready(): Promise<{
        status: string;
        error?: undefined;
    } | {
        status: string;
        error: string;
    }>;
}
