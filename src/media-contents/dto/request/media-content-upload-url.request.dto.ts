import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MediaType } from '@prisma/client';

export class MediaContentUploadUrlRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mimeType: string;
}
