import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from '../../schemas/url.schema';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    AnalyticsModule,
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
