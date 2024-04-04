import { Module } from '@nestjs/common';
import { MediaContentsService } from './media-contents.service';
import { S3Module } from '../aws/s3/s3.module';
import { CloudFrontModule } from '../aws/cloud-front/cloud-front.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MediaContentsController } from './media-contents.controller';

@Module({
  imports: [PrismaModule, S3Module, CloudFrontModule],
  controllers: [MediaContentsController],
  providers: [MediaContentsService],
})
export class MediaContentsModule {}
