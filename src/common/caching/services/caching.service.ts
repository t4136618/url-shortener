import { Cache } from 'cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from '../../logger/services/logger.service';
import { ConfigService } from '../../config/services/config.service';

@Injectable()
export class CachingService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    logger.setContext(`${this.constructor.name}`);
  }

  async get(key): Promise<any> {
    try {
      this.logger.debug('Redis get key ' + key);

      return await this.cache.get(key);
    } catch {
      this.logger.error('Redis failed to get key ' + key);

      return null;
    }
  }

  async set(key, value, ttl?: number): Promise<void> {
    try {
      this.logger.debug(
        'Redis set key ' + key + ' with value: ' + JSON.stringify(value),
      );

      await this.cache.set(key, value, {
        ttl: ttl ?? this.configService.redisEnvs.ttl,
      } as any);
    } catch {
      this.logger.error('Redis failed to set key ' + key);
    }
  }

  async del(key): Promise<void> {
    try {
      this.logger.debug('Redis del key ' + key);

      await this.cache.del(key);
    } catch {
      this.logger.error('Redis failed to del key ' + key);
    }
  }

  async clear(): Promise<void> {
    try {
      this.logger.debug('Redis reset');

      await this.cache.reset();
    } catch {
      this.logger.error('Redis reset failed');
    }
  }
}
