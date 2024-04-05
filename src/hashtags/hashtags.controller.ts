import { Controller, Get, Query, SerializeOptions } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HashtagsService } from './hashtags.service';
import { HashtagDto } from './dto/response/hashtag.dto';
import { GetHashtagsRequestDto } from './dto/request/get-hashtags.request.dto';

@ApiTags('해시태그')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get()
  @ApiOperation({ summary: '해시태그 조회' })
  @ApiOkResponse({ type: [HashtagDto] })
  @SerializeOptions({ type: HashtagDto })
  async getHashtags(
    @Query() query: GetHashtagsRequestDto,
  ): Promise<HashtagDto[]> {
    return await this.hashtagsService.getHashtags(query.tagQ);
  }
}
