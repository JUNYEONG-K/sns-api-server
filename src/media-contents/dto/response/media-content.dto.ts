import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaType } from '@prisma/client';

export class MediaContentDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: MediaType;

  @ApiProperty()
  @Expose()
  mimeType: string;

  @ApiProperty()
  @Expose()
  url: string;
}
