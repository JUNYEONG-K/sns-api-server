import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFeedRequestDto } from './dto/request/upload-feed.request.dto';
import { Feeds, Users } from '@prisma/client';
import { FollowsService } from '../follows/follows.service';
import { FeedDto } from './dto/response/feed.dto';

@Injectable()
export class FeedsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followsService: FollowsService,
  ) {}

  async create(userId: number, textContents: string): Promise<Feeds> {
    return await this.prisma.feeds.create({
      data: { userId, textContents },
    });
  }

  async upload(userId: number, args: UploadFeedRequestDto): Promise<void> {
    const { textContents } = args;
    await this.create(userId, textContents);
  }

  async getUserFeeds(userId: number): Promise<Feeds[]> {
    return await this.prisma.feeds.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeedsByUsers(
    userIds: number[],
  ): Promise<(Feeds & { user: Users })[]> {
    return await this.prisma.feeds.findMany({
      where: { userId: { in: userIds } },
      include: { user: true },
      orderBy: { createdAt: 'desc' }, // TODO: feeds 의 createdAt 이 아니라... user 의 uploadAt 을 기준으로 할 수도 있을 듯?
    });
  }

  async getFollowingFeeds(userId: number): Promise<FeedDto[]> {
    const followingUserIds =
      await this.followsService.getFollowingUserIds(userId);
    const feeds = await this.getFeedsByUsers(followingUserIds);
    return feeds.map((feed) => this.buildFeedDto(feed));
  }

  // TODO: 음.. 이거 나중에 usersService 랑 순환참조 생길 것 같은데... 어떻게 하는게 좋을까?
  buildFeedDto(feed: Feeds & { user: Users }): FeedDto {
    return {
      ...feed,
      user: { ...feed.user },
    };
  }
}
