import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from '../../schemas/url.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
