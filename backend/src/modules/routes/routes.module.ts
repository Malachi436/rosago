import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RouteAutoService } from './route-auto.service';
import { RoutesController } from './routes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoutesController],
  providers: [RoutesService, RouteAutoService],
  exports: [RoutesService],
})
export class RoutesModule {}