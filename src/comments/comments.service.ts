import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveCommentRequestDto } from './dto/request/leave-comment.request.dto';
import { Comments, Users } from '@prisma/client';
import { CommentDto } from './dto/response/comment.dto';
import { FeedsService } from '../feeds/feeds.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly feedsService: FeedsService,
  ) {}

  async createComment(
    userId: number,
    feedId: number,
    textContents: string,
  ): Promise<Comments> {
    return await this.prisma.comments.create({
      data: { userId, feedId, textContents },
    });
  }

  async leaveComment(
    userId: number,
    args: LeaveCommentRequestDto,
  ): Promise<void> {
    const { feedId, textContents, hashtags } = args;
    await this.createComment(userId, feedId, textContents);
    if (hashtags.length > 0)
      await this.feedsService.assignHashtag(feedId, hashtags);
  }

  async getCommentsByFeedId(
    feedId: number,
  ): Promise<(Comments & { user: Users })[]> {
    return await this.prisma.comments.findMany({
      where: { feedId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeedComments(feedId: number): Promise<CommentDto[]> {
    const comments = await this.getCommentsByFeedId(feedId);
    return comments.map((comment) => this.buildCommentDto(comment));
  }

  buildCommentDto(comment: Comments & { user: Users }): CommentDto {
    return {
      user: { ...comment.user },
      ...comment,
    };
  }

  async getLikeComments(userId: number): Promise<CommentDto[]> {
    const commentLikes = await this.prisma.commentLikes.findMany({
      where: { userId },
      include: {
        comment: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return commentLikes.map((commentLike) => {
      const comment: Comments & { user: Users } = {
        ...commentLike.comment,
        user: commentLike.user,
      };
      return this.buildCommentDto(comment);
    });
  }
}
