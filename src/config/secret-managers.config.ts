import { ConfigService } from '@nestjs/config';
import { fetchSecrets } from './fetch-secrets';

export default async () => {
  const configService = new ConfigService();
  const secretName = configService.getOrThrow<string>('AWS_SECRET_NAME');
  const secrets = await fetchSecrets(secretName);

  return {
    cloudfront: {
      distributionDomainName: secrets.CLOUDFRONT_DOMAIN_NAME,
      privateKey: secrets.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      publicKeyId: secrets.CLOUDFRONT_PUBLIC_KEY_ID,
    },
  };
};
