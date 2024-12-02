import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Redirect,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UrlService } from '../services/url.service';
import { GenerateShortUrlDto } from '../dto/generate-short-url.dto';
import { UpdateShortUrlDto } from '../dto/update-short-url.dto';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import { LoggerService } from '../../../common/logger/services/logger.service';

@ApiTags('urls')
@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly analyticsService: AnalyticsService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Generate a short URL' })
  @ApiBody({ type: GenerateShortUrlDto })
  @ApiResponse({ status: 201, description: 'Short URL generated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async generateShortUrl(
    @Body() { longUrl, expirationDate }: GenerateShortUrlDto,
  ): Promise<string> {
    if (!longUrl) {
      throw new BadRequestException('Long URL is required');
    }

    const date = expirationDate ? new Date(expirationDate) : undefined;
    if (date && date <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }

    try {
      return await this.urlService.generateShortUrl(longUrl, date);
    } catch (error) {
      this.loggerService.error(error);

      throw new InternalServerErrorException(
        'An error occurred while generating the short URL',
      );
    }
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Redirect to the original long URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({ status: 302, description: 'Redirect to the long URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @Redirect()
  async redirectToLongUrl(@Param('shortId') shortId: string) {
    try {
      const longUrl = await this.urlService.getLongUrl(shortId);

      if (!longUrl) {
        throw new NotFoundException('URL not found');
      }

      await this.analyticsService.trackAccess(shortId);

      return { url: longUrl };
    } catch (error) {
      this.loggerService.error(error);

      throw new InternalServerErrorException(
        'An error occurred while retrieving the long URL',
      );
    }
  }

  @Get('info/:shortId')
  @ApiOperation({ summary: 'Get information about a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({ status: 200, description: 'URL info retrieved successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async getUrlInfo(@Param('shortId') shortId: string) {
    try {
      const url = await this.urlService.getUrlInfo(shortId);

      if (!url) {
        throw new NotFoundException('URL not found');
      }

      return url;
    } catch (error) {
      this.loggerService.error(error);

      throw new InternalServerErrorException(
        'An error occurred while retrieving URL information',
      );
    }
  }

  @Delete(':shortId')
  @ApiOperation({ summary: 'Delete a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async deleteShortUrl(@Param('shortId') shortId: string) {
    try {
      const result = await this.urlService.deleteShortUrl(shortId);

      if (!result) {
        throw new NotFoundException('URL not found');
      }

      return { message: 'URL deleted successfully' };
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the short URL',
      );
    }
  }

  @Put(':shortId')
  @ApiOperation({ summary: 'Update a long URL for a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiBody({ type: UpdateShortUrlDto })
  @ApiResponse({ status: 200, description: 'Short URL updated successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async updateShortUrl(
    @Param('shortId') shortId: string,
    @Body() { longUrl }: UpdateShortUrlDto,
  ) {
    if (!longUrl) {
      throw new BadRequestException('New long URL is required');
    }

    try {
      const updatedUrl = await this.urlService.updateShortUrl(shortId, longUrl);

      if (!updatedUrl) {
        throw new NotFoundException('URL not found');
      }

      return updatedUrl;
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the short URL',
      );
    }
  }
}
