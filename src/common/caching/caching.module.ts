import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CachingService } from './services/caching.service';
import { ConfigService } from '../config/services/config.service';
import { AppConfigModule } from '../config/config.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService): any => ({
        store: redisStore,
        url: `redis://${configService.redisEnvs.host}:${configService.redisEnvs.port}`,
      }),
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
