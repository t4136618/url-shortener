import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional, IsDateString } from 'class-validator';

export class GenerateShortUrlDto {
  @ApiProperty({
    description: 'The long URL to be shortened',
    example: 'https://www.example.com',
  })
  @IsString()
  @IsUrl()
  longUrl: string;

  @ApiProperty({
    description:
      'Optional expiration date for the short URL in ISO 8601 format',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
