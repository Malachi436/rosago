import { PrismaService } from '../../prisma/prisma.service';
export declare class RouteAutoService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    autoGenerateRoutes(schoolId: string): Promise<any>;
    private kMeansClustering;
    private initializeCentroids;
    private findNearestCentroid;
    private calculateCentroid;
    private distance;
    private toRad;
    private orderStops;
    private generateRouteLabels;
    private numberToLetters;
}
