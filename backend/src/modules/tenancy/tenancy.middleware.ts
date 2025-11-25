import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenancyService } from './tenancy.service';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(private tenancyService: TenancyService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract companyId and schoolId from JWT payload (would be attached by auth middleware)
    const user = (req as any).user;
    
    if (user) {
      const companyId = this.tenancyService.extractCompanyIdFromJwtPayload(user);
      const schoolId = this.tenancyService.extractSchoolIdFromJwtPayload(user);
      
      // Attach to request for use in services
      (req as any).companyId = companyId;
      (req as any).schoolId = schoolId;
    }
    
    next();
  }
}