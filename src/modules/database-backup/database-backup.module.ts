import { Module } from '@nestjs/common';
import { DatabaseBackupService } from './services/database-backup.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [DatabaseBackupService],
})
export class DatabaseBackupModule {}
