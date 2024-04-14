import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty()
  @Expose()
  email: string;

  // TODO: optional 이 아닌 처리를 해주어야 함.
  @ApiPropertyOptional()
  @Expose()
  following?: boolean;
}
