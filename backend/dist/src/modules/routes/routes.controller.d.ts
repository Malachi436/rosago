import { RoutesService } from './routes.service';
import { RouteAutoService } from './route-auto.service';
export declare class RoutesController {
    private readonly routesService;
    private readonly routeAutoService;
    constructor(routesService: RoutesService, routeAutoService: RouteAutoService);
    create(createRouteDto: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findBySchool(schoolId: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, updateRouteDto: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    autoGenerateRoutes(schoolId: string): Promise<any>;
}
