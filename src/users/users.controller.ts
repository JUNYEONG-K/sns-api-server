import { Controller, Get, SerializeOptions, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthGuard } from '../auth/guard/user-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { UsersService } from './users.service';
import { UserDto } from './dto/response/user.dto';

@ApiTags('유저')
@Controller('users')
@UseGuards(UserAuthGuard)
@ApiBearerAuth('user-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: '유저 본인 정보 조회',
  })
  @ApiOkResponse({
    description: '유저 정보',
    type: UserDto,
  })
  @SerializeOptions({ type: UserDto })
  async getMe(@CurrentUser() user: Users): Promise<UserDto> {
    return this.usersService.buildUserDto(user);
  }

  @Get('me/followers')
  @ApiOperation({ summary: '팔로워 목록 조회' })
  @ApiOkResponse({ type: [UserDto] })
  @SerializeOptions({ type: UserDto })
  async getFollowers(@CurrentUser() user: Users): Promise<UserDto[]> {
    const followers = await this.usersService.getFollowers(user.id);
    return followers.map((follower) =>
      this.usersService.buildUserDto(follower),
    );
  }

  @Get('me/followings')
  @ApiOperation({ summary: '팔로잉 목록 조회' })
  @ApiOkResponse({ type: [UserDto] })
  @SerializeOptions({ type: UserDto })
  async getFollowings(@CurrentUser() user: Users): Promise<UserDto[]> {
    const followings = await this.usersService.getFollowings(user.id);
    return followings.map((following) =>
      this.usersService.buildUserDto(following),
    );
  }
}
