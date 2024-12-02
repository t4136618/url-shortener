import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CachingService } from '../../../common/caching/services/caching.service';
import { Url } from '../../../schemas/url.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private readonly redisCacheService: CachingService,
  ) {}

  private base62Encode(): string {
    return uuidv4(); // Replace with a Base62 encoding method if required
  }

  getShortUrl(shortId: string): string {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    return `http://${host}:${port}/url/${shortId}`;
  }

  async generateShortUrl(longUrl: string): Promise<string> {
    const existingUrl = await this.urlModel.findOne({ longUrl });

    if (existingUrl) {
      return this.getShortUrl(existingUrl.shortId);
    }

    const shortId = this.base62Encode();
    const shortUrl = this.getShortUrl(shortId);

    const newUrl = new this.urlModel({
      longUrl,
      shortId,
    });

    await newUrl.save();
    await this.redisCacheService.set(shortId, longUrl);
    return shortUrl;
  }

  async getLongUrl(shortId: string): Promise<string | null> {
    let longUrl = await this.redisCacheService.get(shortId);
    if (!longUrl) {
      const url = await this.urlModel.findOne({ shortId });
      if (url) {
        longUrl = url.longUrl;
        await this.redisCacheService.set(shortId, longUrl);
      }
    }
    return longUrl;
  }

  async getUrlInfo(shortId: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortId }).exec();
  }

  async deleteShortUrl(shortId: string): Promise<boolean> {
    const result = await this.urlModel.deleteOne({ shortId }).exec();
    if (result.deletedCount > 0) {
      await this.redisCacheService.del(shortId);
      return true;
    }
    return false;
  }

  async updateShortUrl(
    shortId: string,
    newLongUrl: string,
  ): Promise<Url | null> {
    const url = await this.urlModel
      .findOneAndUpdate({ shortId }, { longUrl: newLongUrl }, { new: true })
      .exec();

    if (url) {
      await this.redisCacheService.set(shortId, newLongUrl);
    }

    return url;
  }
}
