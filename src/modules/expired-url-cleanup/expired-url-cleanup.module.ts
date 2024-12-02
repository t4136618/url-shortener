import { Module } from '@nestjs/common';
import { ExpiredUrlCleanupService } from './services/expired-url-cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from '../../schemas/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [ExpiredUrlCleanupService],
})
export class ExpiredUrlCleanupModule {}
