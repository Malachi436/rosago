import { Module } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyMiddleware } from './tenancy.middleware';

@Module({
  providers: [TenancyService],
  exports: [TenancyService],
})
export class TenancyModule {}