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
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('user-auth')
  @SerializeOptions({ type: UserDto })
  async getMe(@CurrentUser() user: Users): Promise<UserDto> {
    return this.usersService.buildUserDto(user);
  }
}
