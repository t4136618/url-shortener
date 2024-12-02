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
    this.logger.setContext(this.constructor.name);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      this.logger.debug(`Attempting to retrieve key from cache: ${key}`);
      const result = await this.cache.get<T>(key);
      this.logger.debug(
        `Cache hit for key: ${key}. Value: ${this.safeStringify(result)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving key "${key}" from cache: ${error.message}`,
      );
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const computedTtl = ttl ?? this.configService.redisEnvs.ttl;
    try {
      this.logger.debug(
        `Setting key in cache: ${key} -> Value: ${this.safeStringify(value)}, TTL: ${computedTtl}`,
      );
      await this.cache.set(key, value, computedTtl);
    } catch (error) {
      this.logger.error(
        `Error setting key "${key}" in cache: ${error.message}`,
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.logger.debug(`Deleting key from cache: ${key}`);
      await this.cache.del(key);
      this.logger.debug(`Key successfully deleted: ${key}`);
    } catch (error) {
      this.logger.error(
        `Error deleting key "${key}" from cache: ${error.message}`,
      );
    }
  }

  async clear(): Promise<void> {
    try {
      this.logger.debug(`Clearing all cache entries`);
      await this.cache.reset();
      this.logger.debug(`Cache successfully cleared`);
    } catch (error) {
      this.logger.error(`Error clearing cache: ${error.message}`);
    }
  }

  private safeStringify(value: any): string {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Unserializable value]';
    }
  }
}
