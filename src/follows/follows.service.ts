import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Follows } from '@prisma/client';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: number, followeeId: number): Promise<Follows> {
    return await this.prisma.follows.create({
      data: { followerId, followeeId },
    });
  }

  async unfollow(followerId: number, followeeId: number): Promise<Follows> {
    return await this.prisma.follows.delete({
      where: { followeeId_followerId: { followeeId, followerId } },
    });
  }
}
