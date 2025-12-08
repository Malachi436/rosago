import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  create(@Body() createDriverDto: any) {
    console.log('[DriversController] POST /drivers called with data:', createDriverDto);
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id/today-trip')
  @Roles('DRIVER')
  async getTodayTrip(@Param('id') userId: string, @Req() req) {
    console.log('[DriversController] getTodayTrip called with userId:', userId);
    console.log('[DriversController] Authenticated user:', req.user);
    
    // Security: Ensure the authenticated user matches the requested user ID
    if (req.user.userId !== userId) {
      console.warn('[DriversController] User mismatch - token userId:', req.user.userId, 'requested:', userId);
      throw new ForbiddenException('You can only access your own trip data');
    }
    
    // Find the driver record by user ID
    const driver = await this.driversService.findByUserId(userId);
    console.log('[DriversController] Found driver:', driver);
    if (!driver) {
      console.log('[DriversController] No driver found for userId:', userId);
      return null;
    }
    const trip = await this.driversService.getTodayTrip(driver.id);
    console.log('[DriversController] Found trip:', trip);
    return trip;
  }

  @Get(':id')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN', 'DRIVER')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  update(@Param('id') id: string, @Body() updateDriverDto: any) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @Roles('PLATFORM_ADMIN', 'COMPANY_ADMIN')
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}