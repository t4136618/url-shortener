import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from '../../../schemas/url.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) {}

  async trackAccess(shortId: string): Promise<void> {
    try {
      const url = await this.urlModel.findOne({ shortId });
      if (!url) {
        throw new NotFoundException(`URL with ID "${shortId}" not found`);
      }

      url.accessCount += 1;
      url.accessTimestamps.push(new Date());
      await url.save();
    } catch {
      throw new InternalServerErrorException(
        `Failed to track access for URL with ID "${shortId}"`,
      );
    }
  }

  async getAccessCount(shortId: string): Promise<number> {
    try {
      const url = await this.urlModel.findOne({ shortId });
      if (!url) {
        throw new NotFoundException(`URL with ID "${shortId}" not found`);
      }

      return url.accessCount;
    } catch {
      throw new InternalServerErrorException(
        `Failed to retrieve access count for URL with ID "${shortId}"`,
      );
    }
  }

  async getAccessTimestamps(shortId: string): Promise<Date[]> {
    try {
      const url = await this.urlModel.findOne({ shortId });
      if (!url) {
        throw new NotFoundException(`URL with ID "${shortId}" not found`);
      }

      return url.accessTimestamps;
    } catch {
      throw new InternalServerErrorException(
        `Failed to retrieve access timestamps for URL with ID "${shortId}"`,
      );
    }
  }
}
