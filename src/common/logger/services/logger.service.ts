import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    defaultMeta: {
      context: 'NestJS',
      service: process.env.SERVICE_NAME || 'Unknown-Service',
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.printf(
        ({ level, message, context, timestamp }) =>
          `${timestamp} [${context}] [Level]: ${level}: ${message}`,
      ),
    ),
    transports: [new winston.transports.Console()],
  });

  private logMessage(level: string, message: string, ...meta: any[]): void {
    this.logger[level](message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.logMessage('error', message, ...meta);
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
