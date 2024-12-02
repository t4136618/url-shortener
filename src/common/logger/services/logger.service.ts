import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(({ level, message, context, timestamp }) => {
        return `${timestamp} [${context || 'NestJS'}] [Level]: ${level}: ${message}`;
      }),
    );

    const jsonFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      defaultMeta: {
        service: process.env.SERVICE_NAME || 'Unknown-Service',
      },
      format: isProduction ? jsonFormat : format,
      transports: [
        new winston.transports.Console(),
        ...(isProduction
          ? [
              new winston.transports.File({
                filename: 'error.log',
                level: 'error',
              }),
            ]
          : []),
      ],
    });
  }

  private logMessage(level: string, message: string, ...meta: any[]): void {
    this.logger.log(level, message, { meta });
  }

  error(message: string, error?: Error, ...meta: any[]): void {
    const errorDetails = error
      ? { message: error.message, stack: error.stack }
      : undefined;
    this.logMessage('error', message, { error: errorDetails, ...meta });
  }

  log(message: string, ...meta: any[]): void {
    this.logMessage('info', message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.logMessage('warn', message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logMessage('debug', message, ...meta);
  }

  setContext(context: string): void {
    this.logger.defaultMeta = { ...this.logger.defaultMeta, context };
  }
}
