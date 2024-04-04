import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MediaContentUploadUrlResponseDto {
  @ApiProperty()
  @Expose()
  mediaContentId: number;

  @ApiProperty()
  @Expose()
  putSignedUrl: string;
}
