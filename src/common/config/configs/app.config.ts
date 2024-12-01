import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('application', () => ({
  name: process.env.SERVICE_NAME,
  version: process.env.APPLICATION_VERSION,
  port: Number.parseInt(process.env.PORT, 10),
  salt: Number.parseInt(process.env.SALT, 10),
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  redisEnvs: {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT, 10),
    ttl: process.env.REDIS_TTL,
  },
}));
