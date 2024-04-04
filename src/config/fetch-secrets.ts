import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export const fetchSecrets = async (secretName: string): Promise<any> => {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'develop'
  ) {
    const configService = new ConfigService();

    const client = new SecretsManagerClient({
      region: configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('SECRET_ACCESS_KEY'),
      },
    });
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );

    if (!response.SecretString) throw new Error('No secret string');

    return JSON.parse(response.SecretString);
  } else {
    const envFile = path.resolve(__dirname, '../../../sns-api-server/.env');
    return dotenv.parse(fs.readFileSync(envFile));
  }
};
