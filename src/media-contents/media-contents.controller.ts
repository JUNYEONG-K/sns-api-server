import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MediaContentsService } from './media-contents.service';
import { MediaContentUploadUrlResponseDto } from './dto/response/media-content-upload-url.response.dto';
import { MediaContentUploadUrlRequestDto } from './dto/request/media-content-upload-url.request.dto';
import { MediaContentDto } from './dto/response/media-content.dto';

@ApiTags('미디어 컨텐츠')
@Controller('media-contents')
export class MediaContentsController {
  constructor(private readonly mediaContentsService: MediaContentsService) {}

  @Post('prepare-upload')
  @ApiOperation({
    summary: '컨텐츠 업로드',
  })
  @ApiCreatedResponse({
    description: '컨텐츠 업로드 url',
    type: MediaContentUploadUrlResponseDto,
  })
  @SerializeOptions({ type: MediaContentUploadUrlResponseDto })
  async createMediaContent(
    @Body() mediaContentsDto: MediaContentUploadUrlRequestDto,
  ): Promise<MediaContentUploadUrlResponseDto> {
    return this.mediaContentsService.getUploadUrl(mediaContentsDto);
  }

  @Post(':mediaContentId/complete-upload')
  @ApiOperation({
    summary: '컨텐츠 업로드 성공',
  })
  @ApiCreatedResponse({
    description: '컨텐츠 정보',
    type: MediaContentDto,
  })
  @SerializeOptions({ type: MediaContentDto })
  async completeUploadMediaContent(
    @Param('mediaContentId') mediaContentId: number,
  ): Promise<MediaContentDto> {
    return this.mediaContentsService.completeUpload(mediaContentId);
  }

  @Get(':mediaContentId')
  @ApiOperation({
    summary: '컨텐츠 조회',
  })
  @ApiResponse({
    status: 307,
  })
  async getContentsUrl(
    @Param('mediaContentId') mediaContentId: number,
    @Res() res: Response,
  ) {
    const url = await this.mediaContentsService.getViewUrl(mediaContentId);

    // TODO: @Redirect() 데코레이터 사용하도록
    res.redirect(307, url);
  }
}
