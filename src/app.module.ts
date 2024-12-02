import { Module } from '@nestjs/common';
import { UrlModule } from './modules/url/url.module';
import { CachingModule } from './common/caching/caching.module';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigModule } from './common/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseBackupModule } from './modules/database-backup/database-backup.module';

@Module({
  imports: [
    UrlModule,
    CachingModule,
    AppConfigModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject the ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('database.username')}:${configService.get('database.password')}@${configService.get('database.host')}:${configService.get('database.port')}`,
        dbName: configService.get('database.schema'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    DatabaseBackupModule,
  ],
})
export class AppModule {}
