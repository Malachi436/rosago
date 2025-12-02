import { Module } from '@nestjs/common';
import { ScheduledRoutesService } from './scheduled-routes.service';
import { ScheduledRoutesController } from './scheduled-routes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScheduledRoutesController],
  providers: [ScheduledRoutesService],
  exports: [ScheduledRoutesService],
})
export class ScheduledRoutesModule {}
