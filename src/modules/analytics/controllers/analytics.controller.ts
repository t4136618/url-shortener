import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('access-count/:shortId')
  @ApiOperation({ summary: 'Retrieve the access count for a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({
    status: 200,
    description: 'Access count retrieved successfully',
    schema: {
      example: { shortId: 'abc123', accessCount: 42 },
    },
  })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async getAccessCount(@Param('shortId') shortId: string) {
    try {
      const accessCount = await this.analyticsService.getAccessCount(shortId);
      return { shortId, accessCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(
        `Failed to retrieve access count for URL with ID "${shortId}"`,
      );
    }
  }

  @Get('access-timestamps/:shortId')
  @ApiOperation({ summary: 'Retrieve the access timestamps for a short URL' })
  @ApiParam({ name: 'shortId', description: 'The unique short URL ID' })
  @ApiResponse({
    status: 200,
    description: 'Access timestamps retrieved successfully',
    schema: {
      example: {
        shortId: 'abc123',
        accessTimestamps: [
          '2023-11-01T10:00:00.000Z',
          '2023-11-02T12:30:00.000Z',
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async getAccessTimestamps(@Param('shortId') shortId: string) {
    try {
      const timestamps =
        await this.analyticsService.getAccessTimestamps(shortId);
      return { shortId, accessTimestamps: timestamps };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(
        `Failed to retrieve access timestamps for URL with ID "${shortId}"`,
      );
    }
  }
}
