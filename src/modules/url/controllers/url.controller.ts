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

@ApiTags('urls') // Groups the endpoints under 'urls' in Swagger UI
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Generate a short URL' })
  @ApiBody({ type: GenerateShortUrlDto })
  @ApiResponse({ status: 201, description: 'Short URL generated' })
  async generateShortUrl(
    @Body() { longUrl }: GenerateShortUrlDto,
  ): Promise<string> {
    if (!longUrl) {
      throw new BadRequestException('Long URL is required');
    }
    return this.urlService.generateShortUrl(longUrl);
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Redirect to the original long URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({ status: 302, description: 'Redirect to the long URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @Redirect()
  async redirectToLongUrl(@Param('shortId') shortId: string) {
    const longUrl = await this.urlService.getLongUrl(shortId);

    if (!longUrl) {
      throw new NotFoundException('URL not found');
    }

    return { url: longUrl };
  }

  @Get('info/:shortId')
  @ApiOperation({ summary: 'Get information about a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({ status: 200, description: 'URL info retrieved successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async getUrlInfo(@Param('shortId') shortId: string) {
    const url = await this.urlService.getUrlInfo(shortId);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  @Delete(':shortId')
  @ApiOperation({ summary: 'Delete a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async deleteShortUrl(@Param('shortId') shortId: string) {
    const result = await this.urlService.deleteShortUrl(shortId);

    if (!result) {
      throw new NotFoundException('URL not found');
    }

    return { message: 'URL deleted successfully' };
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
    const updatedUrl = await this.urlService.updateShortUrl(shortId, longUrl);

    if (!updatedUrl) {
      throw new NotFoundException('URL not found');
    }

    return updatedUrl;
  }
}
