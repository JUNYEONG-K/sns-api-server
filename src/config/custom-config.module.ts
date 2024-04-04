import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import secretManagersConfig from './secret-managers.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [secretManagersConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class CustomConfigModule {}
