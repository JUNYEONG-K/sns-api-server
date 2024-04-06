import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LikeService } from './like.service';
import { Feeds } from '@prisma/client';

@Injectable()
export class FeedsLikeService implements LikeService<Feeds> {
  constructor(private readonly prisma: PrismaService) {}

  async like(targetId: number, userId: number): Promise<void> {
    await this.prisma.feedLikes.upsert({
      where: { feedId_userId: { feedId: targetId, userId } },
      create: { feedId: targetId, userId },
      update: {},
    });
  }

  async deleteLike(targetId: number, userId: number): Promise<void> {
    await this.prisma.feedLikes.delete({
      where: { feedId_userId: { feedId: targetId, userId } },
    });
  }

  async getUserLikes(userId: number): Promise<Feeds[]> {
    const feedLikes = await this.prisma.feedLikes.findMany({
      where: { userId },
      include: { feed: true },
      orderBy: { createdAt: 'desc' },
    });

    return feedLikes.map((feedLike) => feedLike.feed);
  }
}
