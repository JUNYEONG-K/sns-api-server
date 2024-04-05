import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFeedRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  textContents: string;

  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  hashtagIds: number[]; //TODO: hashtags: string[] 으로 받아서 서버에서 처리해야할 것 같은 느낌?
}
