import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFeedRequestDto } from './dto/request/upload-feed.request.dto';
import { UserAuthGuard } from '../auth/guard/user-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { FeedDto } from './dto/response/feed.dto';

@ApiTags('피드')
@Controller('feeds')
@UseGuards(UserAuthGuard)
@ApiBearerAuth('user-auth')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post()
  @ApiOperation({ summary: '피드 업로드' })
  async uploadFeed(
    @CurrentUser() user: Users,
    @Body() args: UploadFeedRequestDto,
  ): Promise<void> {
    await this.feedsService.upload(user.id, args);
  }

  @Get('following')
  @ApiOperation({ summary: '팔로잉 피드 목록 조회' })
  @ApiOkResponse({ type: [FeedDto] })
  @SerializeOptions({ type: FeedDto })
  async getFollowingFeeds(@CurrentUser() user: Users): Promise<FeedDto[]> {
    return await this.feedsService.getFollowingFeeds(user.id);
  }

  @Get('hashtag/:tag')
  @ApiOperation({ summary: '해시태그 피드 목록 조회' })
  @ApiOkResponse({ type: [FeedDto] })
  @SerializeOptions({ type: FeedDto })
  async getHashtagFeeds(
    @CurrentUser() user: Users,
    @Param('tag') tag: string,
  ): Promise<FeedDto[]> {
    return await this.feedsService.getHashtagFeeds(user.id, tag);
  }
}
