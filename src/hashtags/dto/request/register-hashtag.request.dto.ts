import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterHashtagRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tag: string;
}
