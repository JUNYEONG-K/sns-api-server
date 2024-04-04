import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly USER_JWT_SECRET_KEY = this.configService.getOrThrow<string>(
    'USER_JWT_SECRET_KEY',
  );
  private readonly USER_JWT_EXPIRED_IN = this.configService.getOrThrow<string>(
    'USER_JWT_EXPIRED_IN', // 30m
  );

  async issueUserAccessToken(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.USER_JWT_SECRET_KEY,
      expiresIn: this.USER_JWT_SECRET_KEY,
    });
  }
}
