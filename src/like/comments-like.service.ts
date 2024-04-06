import { Injectable } from '@nestjs/common';
import { LikeService } from './like.service';
import { Comments } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsLikeService implements LikeService<Comments> {
  constructor(private readonly prisma: PrismaService) {}

  async createLike(targetId: number, userId: number): Promise<void> {
    await this.prisma.commentLikes.create({
      data: { commentId: targetId, userId },
    });
  }

  async deleteLike(targetId: number, userId: number): Promise<void> {
    await this.prisma.commentLikes.delete({
      where: { commentId_userId: { commentId: targetId, userId } },
    });
  }

  async getUserLikes(userId: number): Promise<Comments[]> {
    const commentLikes = await this.prisma.commentLikes.findMany({
      where: { userId },
      include: { comment: true },
      orderBy: { createdAt: 'desc' },
    });

    return commentLikes.map((commentLike) => commentLike.comment);
  }
}
