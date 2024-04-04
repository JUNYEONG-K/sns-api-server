import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudfrontSigner from '@aws-sdk/cloudfront-signer';

@Injectable()
export class CloudFrontService {
  constructor(private readonly configService: ConfigService) {}

  async getPreSignedUrl(s3ObjectKey: string): Promise<string> {
    const distributionDomainName = this.configService.get(
      'cloudfront.distributionDomainName',
    );

    const url = `${distributionDomainName}/${s3ObjectKey}`;

    const privateKey = this.configService
      .get('cloudfront.privateKey')
      .replace(/\\n/g, '\n');

    const keyPairId = this.configService.get('cloudfront.publicKeyId');
    const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toUTCString(); // 1 hour

    return cloudfrontSigner.getSignedUrl({
      dateLessThan,
      url,
      keyPairId,
      privateKey,
    });
  }
}
