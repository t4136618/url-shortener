import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as backup from 'mongodb-backup';
import { LoggerService } from '../../../common/logger/services/logger.service';
import { ConfigService } from '../../../common/config/services/config.service';

@Injectable()
export class DatabaseBackupService {
  private readonly backupDir: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.backupDir =
      process.env.BACKUP_DIR || path.resolve(__dirname, '../../../backups');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleBackup() {
    this.loggerService.log('Initiating MongoDB backup...');
    try {
      await this.createBackup();
      this.loggerService.log('Backup completed successfully.');
    } catch (error) {
      this.loggerService.error('Backup failed.', error.stack);
      throw new InternalServerErrorException('Database backup failed');
    }
  }

  private async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

    try {
      await fs.ensureDir(this.backupDir);
    } catch (dirError) {
      this.loggerService.error(
        'Failed to ensure backup directory.',
        dirError.stack,
      );
      throw new InternalServerErrorException(
        'Backup directory creation failed',
      );
    }

    const uri = `mongodb://${this.configService.databaseEnvs.username}:${this.configService.databaseEnvs.password}@${this.configService.databaseEnvs.host}:${this.configService.databaseEnvs.port}`;

    try {
      await this.runBackup(uri, backupPath);
    } catch (error) {
      this.loggerService.error(
        'Error during MongoDB backup creation.',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error during database backup creation',
      );
    }
  }

  private runBackup(uri: string, backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      backup({
        uri: uri,
        root: backupPath,
        callback: (err) => {
          if (err) {
            reject(new Error(`Backup failed: ${err.message}`));
          } else {
            this.loggerService.log(`Backup saved at: ${backupPath}`);
            resolve();
          }
        },
      });
    });
  }
}
