import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const versions = ['0.0.1'];

const info = {
  title: 'SNS API',
  version: versions[versions.length - 1],
  description: 'SNS 앱 API 서버 문서입니다.',
};

export function swaggerConfig(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder();

  const options = documentBuilder
    .setTitle(info.title)
    .setDescription(info.description)
    .setVersion(info.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        in: 'header',
      },
      'user-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
