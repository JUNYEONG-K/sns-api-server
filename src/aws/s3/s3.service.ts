import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service extends S3Client {
  constructor(private readonly configService: ConfigService) {
    super({
      region: configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('SECRET_ACCESS_KEY'),
      },
    });
  }

  private async getSignedUrl(
    command: GetObjectCommand | PutObjectCommand,
  ): Promise<string> {
    return getSignedUrl(this, command, { expiresIn: 3600 });
  }

  async getPutSignedUrl(
    bucketName: string,
    key: string,
    mimeType: string,
  ): Promise<string> {
    return await this.getSignedUrl(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: mimeType,
        ACL: 'private',
      }),
    );
  }
}
