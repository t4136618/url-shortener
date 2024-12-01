import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
import { UrlProvider } from './providers/url.provider';

@Module({
  controllers: [UrlController],
  providers: [UrlService, UrlProvider],
})
export class UrlModule {}
