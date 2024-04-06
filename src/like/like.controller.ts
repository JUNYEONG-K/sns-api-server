import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeedsLikeService } from './feeds-like.service';
import { CommentsLikeService } from './comments-like.service';
import { UserAuthGuard } from '../auth/guard/user-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Users } from '@prisma/client';

@ApiTags('좋아요')
@Controller('like')
@UseGuards(UserAuthGuard)
@ApiBearerAuth('user-auth')
export class LikeController {
  constructor(
    private readonly feedsLikeService: FeedsLikeService,
    private readonly commentsLikeService: CommentsLikeService,
  ) {}

  @Post('feeds/:feedId')
  @ApiOperation({ summary: '피드 좋아요' })
  async likeFeed(
    @CurrentUser() user: Users,
    @Param('feedId') feedId: number,
  ): Promise<void> {
    await this.feedsLikeService.like(feedId, user.id);
  }

  @Post('comments/:commentId')
  @ApiOperation({ summary: '댓글 좋아요' })
  async likeComment(
    @CurrentUser() user: Users,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    await this.commentsLikeService.like(commentId, user.id);
  }

  @Delete('feeds/:feedId')
  @ApiOperation({ summary: '피드 좋아요 취소' })
  async deleteLikeFeed(
    @CurrentUser() user: Users,
    @Param('feedId') feedId: number,
  ): Promise<void> {
    await this.feedsLikeService.deleteLike(feedId, user.id);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: '댓글 좋아요 취소' })
  async deleteLikeComment(
    @CurrentUser() user: Users,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    await this.commentsLikeService.deleteLike(commentId, user.id);
  }
}
