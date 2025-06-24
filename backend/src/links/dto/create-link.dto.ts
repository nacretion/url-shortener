import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkDto {
    @ApiProperty({ example: 'https://example.com' })
    originalUrl: string;

    @ApiPropertyOptional({ example: '2025-07-01T00:00:00.000Z' })
    expiresAt?: Date;

    @ApiPropertyOptional({ example: 'my-alias' })
    alias?: string;
}
