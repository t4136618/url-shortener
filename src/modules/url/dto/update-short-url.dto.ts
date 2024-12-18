import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdateShortUrlDto {
  @ApiProperty({
    description: 'The long URL to be shortened',
    example: 'https://www.example.com',
  })
  @IsString()
  @IsUrl()
  longUrl: string;
}
