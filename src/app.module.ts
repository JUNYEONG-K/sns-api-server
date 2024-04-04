import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { FeedsModule } from './feeds/feeds.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './aws/s3/s3.module';
import { MediaContentsModule } from './media-contents/media-contents.module';
import { CloudFrontModule } from './aws/cloud-front/cloud-front.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    UsersModule,
    PrismaModule,
    FeedsModule,
    AuthModule,
    TokenModule,
    S3Module,
    MediaContentsModule,
    CloudFrontModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
