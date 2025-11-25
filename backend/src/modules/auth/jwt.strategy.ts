import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export type JwtPayload = {
  email: string;
  sub: string;
  role: string;
  companyId: string;
  schoolId: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    // You can fetch additional user details here if needed
    return { 
      userId: payload.sub, 
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId,
      schoolId: payload.schoolId
    };
  }
}