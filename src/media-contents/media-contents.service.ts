import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Service } from '../aws/s3/s3.service';
import { CloudFrontService } from '../aws/cloud-front/cloud-front.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MediaContents, MediaType, MediaStatus } from '@prisma/client';
import { MediaContentUploadUrlRequestDto } from './dto/request/media-content-upload-url.request.dto';
import { MediaContentUploadUrlResponseDto } from './dto/response/media-content-upload-url.response.dto';
import { MediaContentDto } from './dto/response/media-content.dto';

@Injectable()
export class MediaContentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    private readonly cloudFrontService: CloudFrontService,
  ) {}

  private readonly AWS_S3_BUCKET_NAME =
    this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
  private readonly API_BASE_URL =
    this.configService.getOrThrow<string>('API_BASE_URL');

  async create(
    name: string,
    type: MediaType,
    mimeType: string,
  ): Promise<MediaContents> {
    return await this.prisma.mediaContents.create({
      data: { name, type, mimeType },
    });
  }

  async getMediaContent(mediaContentId: number): Promise<MediaContents | null> {
    return await this.prisma.mediaContents.findUnique({
      where: { id: mediaContentId },
    });
  }

  async getMediaContentOrThrow(mediaContentId: number): Promise<MediaContents> {
    const mediaContent = await this.getMediaContent(mediaContentId);
    if (!mediaContent)
      throw new InternalServerErrorException('존재하지 않는 컨텐츠!');
    if (mediaContent.status !== MediaStatus.COMPLETED)
      throw new InternalServerErrorException('업로드 되지 않은 컨텐츠!');
    return mediaContent;
  }

  buildMediaContentDto(mediaContent: MediaContents) {
    return {
      ...mediaContent,
      url: `${this.API_BASE_URL}/contents/${mediaContent.id}`, // 그냥 바로 cloudfront origin url 을 주도록 할 수 있음. (성능 문제 발생한다면)
    };
  }

  async getUploadUrl(
    mediaContentsDto: MediaContentUploadUrlRequestDto,
  ): Promise<MediaContentUploadUrlResponseDto> {
    const { name, type, mimeType } = mediaContentsDto;
    const mediaContent = await this.create(name, type, mimeType);
    const putSignedUrl = await this.s3Service.getPutSignedUrl(
      this.AWS_S3_BUCKET_NAME,
      mediaContent.id.toString(),
      mediaContent.mimeType,
    );

    return {
      mediaContentId: mediaContent.id,
      putSignedUrl,
    };
  }

  async completeUpload(mediaContentId: number): Promise<MediaContentDto> {
    const mediaContent = await this.prisma.mediaContents.update({
      where: { id: mediaContentId },
      data: { status: MediaStatus.COMPLETED },
    });

    return this.buildMediaContentDto(mediaContent);
  }

  async getViewUrl(mediaContentId: number): Promise<string> {
    const mediaContent = await this.getMediaContentOrThrow(mediaContentId);
    return await this.cloudFrontService.getPreSignedUrl(
      mediaContent.id.toString(),
    );
  }
}
