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

  get databaseEnvs(): {
    host: string;
    port: string;
    username: string;
    password: string;
    schema: string;
  } {
    return {
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      schema: this.configService.get('database.schema'),
    };
  }
}
