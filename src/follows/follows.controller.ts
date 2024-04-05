import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FollowsService } from './follows.service';
import { UserAuthGuard } from '../auth/guard/user-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Users } from '@prisma/client';

@ApiTags('팔로우')
@Controller('follows')
@UseGuards(UserAuthGuard)
@ApiBearerAuth('user-auth')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':followeeId')
  @ApiOperation({ summary: '팔로우' })
  async follow(
    @CurrentUser() user: Users,
    @Param('followeeId') followeeId: number,
  ): Promise<void> {
    await this.followsService.follow(user.id, followeeId);
  }

  @Delete(':followeeId')
  @ApiOperation({ summary: '언팔로우' })
  async unfollow(
    @CurrentUser() user: Users,
    @Param('followeeId') followeeId: number,
  ): Promise<void> {
    await this.followsService.unfollow(user.id, followeeId);
  }
}
