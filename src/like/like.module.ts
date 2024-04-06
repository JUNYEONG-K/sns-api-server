import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedsLikeService } from './feeds-like.service';

@Module({
  imports: [PrismaModule],
  providers: [FeedsLikeService],
})
export class LikeModule {}
