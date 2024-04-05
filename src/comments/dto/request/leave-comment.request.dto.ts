import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LeaveCommentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  feedId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  textContents: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  hashtags: string[];
}
