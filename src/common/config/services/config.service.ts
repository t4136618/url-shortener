import { ConfigService as NestConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class ConfigService {
  constructor(
    private readonly configService: NestConfigService,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(`${this.constructor.name}`);
  }

  get isProduction(): boolean {
    return this.configService.get('application.nodeEnv') === 'production';
  }

  get redisEnvs(): {
    host: string;
    port: number;
    ttl: number;
  } {
    return this.configService.get('application.redisEnvs');
  }
}
