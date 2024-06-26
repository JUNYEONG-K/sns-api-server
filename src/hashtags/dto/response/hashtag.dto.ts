import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HashtagDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  tag: string;
}
