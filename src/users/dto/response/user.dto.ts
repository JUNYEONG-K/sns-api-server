import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;
}
