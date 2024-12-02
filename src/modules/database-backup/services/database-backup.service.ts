import { Injectable } from '@nestjs/common';
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
      this.loggerService.error('Backup failed.', error);
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

    await fs.ensureDir(this.backupDir);

    try {
      backup({
        uri: `mongodb://${this.configService.databaseEnvs.username}:${this.configService.databaseEnvs.password}@${this.configService.databaseEnvs.host}:${this.configService.databaseEnvs.port}`, // Replace with your MongoDB URI
        root: backupPath,
        callback: (err) => {
          if (err) {
            throw new Error(`Backup failed: ${err.message}`);
          }
          this.loggerService.log(`Backup saved at: ${backupPath}`);
        },
      });
    } catch (error) {
      this.loggerService.error('Error while creating backup.', error);
      throw error;
    }
  }
}
