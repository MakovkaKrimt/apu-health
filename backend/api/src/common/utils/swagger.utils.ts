import { Type } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(
  app: INestApplication,
  options: {
    title: string;
    description: string;
    version: string;
    tag?: string;
    path?: string;
  },
) {
  const builder = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version)
    .addBearerAuth()
    .addBasicAuth()
    .addApiKey();

  if (options.tag) {
    builder.addTag(options.tag);
  }

  const config = builder.build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(options.path || 'api', app, document);
}
