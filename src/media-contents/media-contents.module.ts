import { Module } from '@nestjs/common';
import { MediaContentsService } from './media-contents.service';

@Module({
  providers: [MediaContentsService],
})
export class MediaContentsModule {}
