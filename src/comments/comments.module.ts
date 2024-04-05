import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedsModule } from '../feeds/feeds.module';

@Module({
  imports: [PrismaModule, FeedsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
