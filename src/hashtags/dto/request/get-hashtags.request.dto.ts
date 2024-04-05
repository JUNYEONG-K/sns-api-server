import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetHashtagsRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  tagQ: string;
}
