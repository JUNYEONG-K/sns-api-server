import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty()
  @Expose()
  email: string;
}
