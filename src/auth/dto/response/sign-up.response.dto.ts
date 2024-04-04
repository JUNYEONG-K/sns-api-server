import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;
}
