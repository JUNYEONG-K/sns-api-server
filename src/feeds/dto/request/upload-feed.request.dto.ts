import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFeedRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  textContents: string;
}
