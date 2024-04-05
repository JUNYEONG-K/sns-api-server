import { Body, Controller, Get, Post, Query, SerializeOptions } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HashtagsService } from './hashtags.service';
import { RegisterHashtagRequestDto } from './dto/request/register-hashtag.request.dto';
import { HashtagDto } from './dto/response/hashtag.dto';
import { GetHashtagsRequestDto } from "./dto/request/get-hashtags.request.dto";

@ApiTags('해시태그')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Post()
  @ApiOperation({ summary: '해시태그 등록' })
  @ApiCreatedResponse({ type: HashtagDto })
  @SerializeOptions({ type: HashtagDto })
  async registerHashtag(
    @Body() args: RegisterHashtagRequestDto,
  ): Promise<HashtagDto> {
    return await this.hashtagsService.registerHashtag(args.tag);
  }

  @Get()
  @ApiOperation({ summary: '해시태그 조회' })
  @ApiOkResponse({ type: [HashtagDto] })
  @SerializeOptions({ type: HashtagDto })
  async getHashtags(@Query() query: GetHashtagsRequestDto) {
    return await this.hashtagsService.getHashtags(query.tagQ);
  }
}
