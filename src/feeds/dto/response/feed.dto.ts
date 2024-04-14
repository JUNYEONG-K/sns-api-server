import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../../users/dto/response/user.dto';

export class FeedDto {
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  @Expose()
  user: UserDto;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  textContents: string;

  @ApiProperty()
  @Expose()
  likeCount: number;

  @ApiProperty()
  @Expose()
  liked: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
