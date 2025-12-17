import { Controller, Get, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles('PLATFORM_ADMIN')
  async getAllCompanies() {
    return this.companiesService.getAllCompanies();
  }

  @Get(':companyId')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  async getCompanyById(@Param('companyId') companyId: string, @Req() req: any) {
    // If user is COMPANY_ADMIN, they can only access their own company
    if (req.user.role === 'COMPANY_ADMIN' && req.user.companyId !== companyId) {
      throw new ForbiddenException('You can only access your own company');
    }
    
    return this.companiesService.getCompanyById(companyId);
  }
}
