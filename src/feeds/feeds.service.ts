import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFeedRequestDto } from './dto/request/upload-feed.request.dto';
import { Feeds, Users, FeedLikes } from '@prisma/client';
import { FollowsService } from '../follows/follows.service';
import { FeedDto } from './dto/response/feed.dto';
import { HashtagsService } from '../hashtags/hashtags.service';

@Injectable()
export class FeedsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followsService: FollowsService,
    private readonly hashtagsService: HashtagsService,
  ) {}

  async create(userId: number, textContents: string): Promise<Feeds> {
    return await this.prisma.feeds.create({
      data: { userId, textContents },
    });
  }

  async upload(userId: number, args: UploadFeedRequestDto): Promise<void> {
    const { textContents, hashtags } = args;
    const feed = await this.create(userId, textContents);
    if (hashtags.length > 0) await this.assignHashtag(feed.id, hashtags);
  }

  // TODO: feed service 에 있는 게 맞나? -> feeds-hashtags.service.ts 를 만들어야 하나?
  async assignHashtag(feedId: number, hashtags: string[]): Promise<void> {
    await Promise.all(
      hashtags.map(async (tag) => {
        const hashtag = await this.hashtagsService.findOrCreateHashTag(tag);
        return await this.prisma.feedsHashtags.create({
          data: { hashtagId: hashtag.id, feedId },
        });
      }),
    );
  }

  async getUserFeeds(userId: number): Promise<Feeds[]> {
    return await this.prisma.feeds.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeedsByUsers(
    userIds: number[],
  ): Promise<(Feeds & { user: Users; feedLikes: FeedLikes[] })[]> {
    return await this.prisma.feeds.findMany({
      where: { userId: { in: userIds } },
      include: { user: true, feedLikes: true },
      orderBy: { createdAt: 'desc' }, // TODO: feeds 의 createdAt 이 아니라... user 의 uploadAt 을 기준으로 할 수도 있을 듯?
    });
  }

  async getFollowingFeeds(userId: number): Promise<FeedDto[]> {
    const followingUserIds =
      await this.followsService.getFollowingUserIds(userId);
    const feeds = await this.getFeedsByUsers(followingUserIds);
    return feeds.map((feed) => this.buildFeedDto(feed));
  }

  buildFeedDto(feed: Feeds & { user: Users; feedLikes: FeedLikes[] }): FeedDto {
    return {
      ...feed,
      user: { ...feed.user },
      likeCount: feed.feedLikes.length,
      liked: !!feed.feedLikes.find(
        (feedLike) => feedLike.userId == feed.user.id,
      ),
    };
  }

  async getHashtagFeeds(userId: number, tag: string): Promise<FeedDto[]> {
    const feedsHashtags = await this.prisma.feedsHashtags.findMany({
      where: {
        hashtag: { is: { tag } },
      },
      include: {
        feed: {
          include: {
            user: true,
            feedLikes: true,
          },
        },
      },
    });

    return feedsHashtags.map((feedsHashtag) =>
      this.buildFeedDto(feedsHashtag.feed),
    );
  }

  async getLikeFeeds(userId: number): Promise<FeedDto[]> {
    const feedLikes = await this.prisma.feedLikes.findMany({
      where: { userId },
      include: {
        feed: {
          include: {
            feedLikes: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return feedLikes.map((feedLike) => {
      const feed: Feeds & { user: Users; feedLikes: FeedLikes[] } = {
        ...feedLike.feed,
        user: feedLike.user,
        feedLikes: feedLike.feed.feedLikes,
      };
      return this.buildFeedDto(feed);
    });
  }
}
