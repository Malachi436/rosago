import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlatformStats(): Promise<any>;
    getCompanyStats(companyId: string): Promise<any>;
    createCompany(data: any): Promise<any>;
    createSchool(companyId: string, data: any): Promise<any>;
    getAllCompanies(): Promise<any>;
    getCompanyById(companyId: string): Promise<any>;
}
