import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../auth/guard/user-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { UsersService } from './users.service';

@ApiTags('유저')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('user-auth')
  async getMe(@CurrentUser() user: Users) {
    return this.usersService.buildUserDto(user);
  }
}
