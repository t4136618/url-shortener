import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigService } from './services/config.service';
import databaseConfig from './configs/database.config';
import appConfig from './configs/app.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['production.env', 'staging.env', 'development.env'],
      load: [databaseConfig, appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'development', 'production', 'staging')
          .default('local'),
        LOG_LEVEL: Joi.string().default('debug'),
        PORT: Joi.number().port().default(8080),
        SALT: Joi.number().integer().positive(),
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.number().port(),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_SCHEMA: Joi.string(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}
