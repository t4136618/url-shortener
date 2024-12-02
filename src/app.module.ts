import { Module } from '@nestjs/common';
import { UrlModule } from './modules/url/url.module';
import { CachingModule } from './common/caching/caching.module';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigModule } from './common/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DatabaseBackupModule } from './modules/database-backup/database-backup.module';
import { ExpiredUrlCleanupModule } from './modules/expired-url-cleanup/expired-url-cleanup.module';

@Module({
  imports: [
    UrlModule,
    CachingModule,
    AppConfigModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('database.username')}:${configService.get('database.password')}@${configService.get('database.host')}:${configService.get('database.port')}`,
        dbName: configService.get('database.schema'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    DatabaseBackupModule,
    ExpiredUrlCleanupModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
