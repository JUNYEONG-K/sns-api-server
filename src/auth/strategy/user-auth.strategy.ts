import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JWTPayload } from 'jose';
import { Users } from '@prisma/client';

@Injectable()
export class UserAuthStrategy extends PassportStrategy(Strategy, 'user-auth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('USER_JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JWTPayload): Promise<Users> {
    const email = String(payload.email);
    return await this.userService.findUserByEmailOrThrow(email);
  }
}
