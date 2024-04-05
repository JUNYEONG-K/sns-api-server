import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthGuard } from '../auth/guard/user-auth.guard';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { LeaveCommentRequestDto } from './dto/request/leave-comment.request.dto';
import { CommentDto } from './dto/response/comment.dto';

@ApiTags('코멘트, 댓글')
@Controller('comments')
@UseGuards(UserAuthGuard)
@ApiBearerAuth('user-auth')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: '댓글 작성' })
  async leaveComment(
    @CurrentUser() user: Users,
    @Body() args: LeaveCommentRequestDto,
  ) {
    await this.commentsService.leaveComment(user.id, args);
  }

  @Get()
  @ApiOperation({ summary: '피드 댓글 조회' })
  @ApiOkResponse({ type: [CommentDto] })
  @SerializeOptions({ type: CommentDto })
  async getFeedComments(
    @Query('feedId') feedId: number,
  ): Promise<CommentDto[]> {
    return await this.commentsService.getFeedComments(feedId);
  }
}
