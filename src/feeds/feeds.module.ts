import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [PrismaModule, FollowsModule],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
