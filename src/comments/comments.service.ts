import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveCommentRequestDto } from './dto/request/leave-comment.request.dto';
import { Comments, Users } from '@prisma/client';
import { CommentDto } from './dto/response/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

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
    const { feedId, textContents } = args;
    await this.createComment(userId, feedId, textContents);
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
}
