import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../../../schemas/url.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExpiredUrlCleanupService {
  private readonly logger = new Logger(ExpiredUrlCleanupService.name);

  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredUrls() {
    const now = new Date();

    try {
      const result = await this.urlModel.deleteMany({
        expirationDate: { $lte: now },
      });

      if (result.deletedCount > 0) {
        this.logger.log(
          `Cleanup completed. Removed ${result.deletedCount} expired URLs.`,
        );
      } else {
        this.logger.log('No expired URLs found to clean up.');
      }
    } catch (error) {
      this.logger.error(
        'An error occurred while cleaning up expired URLs',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error during expired URL cleanup',
      );
    }
  }
}
