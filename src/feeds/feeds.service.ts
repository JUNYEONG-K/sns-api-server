import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFeedRequestDto } from './dto/request/upload-feed.request.dto';
import { Feeds, Users } from '@prisma/client';
import { FollowsService } from '../follows/follows.service';
import { FeedDto } from './dto/response/feed.dto';
import { HashtagsService } from '../hashtags/hashtags.service';
import * as DataLoader from 'dataloader';

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
    const feedLikedCountLoader = this.feedLikedCountLoader();
    const feedLikedLoader = this.feedLikedLoader(userId);
    return await Promise.all(
      feeds.map(
        async (feed) =>
          await this.buildFeedDto(
            userId,
            feed,
            await feedLikedCountLoader.load(feed.id),
            await feedLikedLoader.load(feed.id),
          ),
      ),
    );
  }

  async buildFeedDto(
    userId: number,
    feed: Feeds & { user: Users },
    likeCount: number,
    liked: boolean,
    userFollowing?: boolean,
  ): Promise<FeedDto> {
    return {
      ...feed,
      // TODO: users service, build user dto
      user: {
        ...feed.user,
        following: userFollowing ?? true,
      },
      likeCount,
      liked,
    };
  }

  // TODO: follows service? users service? feeds service?
  userFollowingLoader(userId: number): DataLoader<number, boolean> {
    return new DataLoader<number, boolean>(async (ids: number[]) => {
      const results = await this.prisma.follows.findMany({
        where: { followerId: userId, followeeId: { in: ids } },
      });
      const following = new Map<number, boolean>();
      results.forEach((result) => following.set(result.followeeId, true));

      return ids.map((id) => following.get(id) ?? false);
    });
  }

  feedLikedLoader(userId: number): DataLoader<number, boolean> {
    return new DataLoader<number, boolean>(async (ids: number[]) => {
      const results = await this.prisma.feedLikes.findMany({
        where: { userId, feedId: { in: ids } },
      });
      const liked = new Map<number, boolean>();
      results.forEach((result) => liked.set(result.feedId, true));

      return ids.map((id) => liked.get(id) ?? false);
    });
  }

  feedLikedCountLoader(): DataLoader<number, number> {
    return new DataLoader<number, number>(async (ids: number[]) => {
      const results = await this.prisma.feedLikes.groupBy({
        where: { feedId: { in: ids } },
        by: ['feedId'],
        _count: true,
      });

      const map = new Map<number, number>();
      results.forEach((result) => map.set(result.feedId, result._count));

      return ids.map((id) => map.get(id) ?? 0);
    });
  }

  // TODO: feedUserDtoLoader 는 불가능할까?

  async getHashtagFeeds(userId: number, tag: string): Promise<FeedDto[]> {
    const feedsHashtags = await this.prisma.feedsHashtags.findMany({
      where: {
        hashtag: { is: { tag } },
      },
      include: {
        feed: {
          include: {
            user: true,
          },
        },
      },
    });

    const feedLikedCountLoader = this.feedLikedCountLoader();
    const feedLikedLoader = this.feedLikedLoader(userId);
    const userFollowing = this.userFollowingLoader(userId);

    return await Promise.all(
      feedsHashtags.map(
        async (feedsHashtag) =>
          await this.buildFeedDto(
            userId,
            feedsHashtag.feed,
            await feedLikedCountLoader.load(feedsHashtag.feedId),
            await feedLikedLoader.load(feedsHashtag.feedId),
            await userFollowing.load(feedsHashtag.feed.userId),
          ),
      ),
    );
  }

  async getLikeFeeds(userId: number): Promise<FeedDto[]> {
    const feedLikes = await this.prisma.feedLikes.findMany({
      where: { userId },
      include: {
        feed: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const feedLikedCountLoader = this.feedLikedCountLoader();
    const feedLikedLoader = this.feedLikedLoader(userId);
    const userFollowing = this.userFollowingLoader(userId);

    return await Promise.all(
      feedLikes.map(async (feedLike) => {
        return await this.buildFeedDto(
          userId,
          feedLike.feed,
          await feedLikedCountLoader.load(feedLike.feedId),
          await feedLikedLoader.load(feedLike.feedId),
          await userFollowing.load(feedLike.userId),
        );
      }),
    );
  }
}
