import { Injectable } from '@nestjs/common';

@Injectable()
export class TenancyService {
  extractCompanyIdFromJwtPayload(payload: any): string | null {
    return payload.companyId || null;
  }

  extractSchoolIdFromJwtPayload(payload: any): string | null {
    return payload.schoolId || null;
  }
}