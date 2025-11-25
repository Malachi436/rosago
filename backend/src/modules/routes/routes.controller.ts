import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

@Controller('routes')
@UseGuards(RolesGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  create(@Body() createRouteDto: any) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN', 'DRIVER')
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN', 'DRIVER')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Get('school/:schoolId')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN', 'DRIVER')
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.routesService.findBySchoolId(schoolId);
  }

  @Patch(':id')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  update(@Param('id') id: string, @Body() updateRouteDto: any) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @Roles('PLATFORM_ADMIN')
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}