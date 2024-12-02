import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CachingService } from '../../../common/caching/services/caching.service';
import { Url } from '../../../schemas/url.schema';
import { encode } from 'base62';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private readonly redisCacheService: CachingService,
  ) {}

  getShortUrl(shortId: string): string {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    return `http://${host}:${port}/url/${shortId}`;
  }

  async generateShortUrl(
    longUrl: string,
    expirationDate?: Date,
  ): Promise<string> {
    const existingUrl = await this.urlModel.findOne({ longUrl });

    if (existingUrl) {
      return this.getShortUrl(existingUrl.shortId);
    }

    const id = customAlphabet('1234567890', 18)();
    const shortId = encode(id as unknown as number);
    const shortUrl = this.getShortUrl(shortId);

    const newUrl = new this.urlModel({
      longUrl,
      shortId,
      expirationDate:
        expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    try {
      await newUrl.save();
      await this.redisCacheService.set(shortId, longUrl);
      return shortUrl;
    } catch {
      throw new Error('An error occurred while saving the URL');
    }
  }

  async getLongUrl(shortId: string): Promise<string | null> {
    let longUrl = (await this.redisCacheService.get(shortId)) as string;
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
    try {
      return await this.urlModel.findOne({ shortId }).exec();
    } catch {
      throw new Error('An error occurred while retrieving URL info');
    }
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
    try {
      const url = await this.urlModel
        .findOneAndUpdate({ shortId }, { longUrl: newLongUrl }, { new: true })
        .exec();

      if (url) {
        await this.redisCacheService.set(shortId, newLongUrl);
      }

      return url;
    } catch {
      throw new Error('An error occurred while updating the URL');
    }
  }
}
