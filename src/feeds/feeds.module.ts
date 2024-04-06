import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FollowsModule } from '../follows/follows.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [PrismaModule, FollowsModule, HashtagsModule, LikeModule],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
