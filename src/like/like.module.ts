import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedsLikeService } from './feeds-like.service';
import { LikeController } from './like.controller';
import { CommentsLikeService } from './comments-like.service';

@Module({
  imports: [PrismaModule],
  controllers: [LikeController],
  providers: [FeedsLikeService, CommentsLikeService],
})
export class LikeModule {}
