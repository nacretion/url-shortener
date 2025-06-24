import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Req,
    Res,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Request, Response } from 'express';
import {
    ApiTags,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiOperation,
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller()
export class LinksController {
    constructor(private readonly linksService: LinksService) {}

    @Get('all')
    @ApiOperation({ summary: 'Получить все короткие ссылки' })
    @ApiResponse({ status: 200, description: 'Список всех ссылок' })
    index() {
        return this.linksService.index();
    }

    @Post('shorten')
    @HttpCode(201)
    @ApiOperation({ summary: 'Создать короткую ссылку' })
    @ApiBody({ type: CreateLinkDto })
    @ApiResponse({
        status: 201,
        description: 'Ссылка успешно создана',
        schema: {
            example: {
                shortUrl: 'http://localhost:8000/alias123',
            },
        },
    })
    shorten(@Body() dto: CreateLinkDto) {
        return this.linksService.create(dto);
    }

    @Get('info/:alias')
    @ApiOperation({ summary: 'Получить информацию о ссылке' })
    @ApiParam({ name: 'alias', example: 'abc123' })
    @ApiResponse({
        status: 200,
        description: 'Информация о ссылке',
        schema: {
            example: {
                originalUrl: 'https://example.com',
                createdAt: '2025-06-23T15:00:00.000Z',
                clickCount: 42,
            },
        },
    })
    async info(@Param('alias') alias: string) {
        const { originalUrl, createdAt, clickCount } =
            await this.linksService.info(alias);

        return { originalUrl, createdAt, clickCount };
    }

    @Get('analytics/:alias')
    @ApiOperation({ summary: 'Получить аналитику по ссылке' })
    @ApiParam({ name: 'alias', example: 'abc123' })
    @ApiResponse({
        status: 200,
        description: 'Аналитика по ссылке',
        schema: {
            example: {
                clickCount: 42,
                lastIps: ['192.168.0.1', '203.0.113.55', '...'],
            },
        },
    })
    analytics(@Param('alias') alias: string) {
        return this.linksService.analytics(alias);
    }

    @Delete('delete/:alias')
    @ApiOperation({ summary: 'Удалить короткую ссылку' })
    @ApiParam({ name: 'alias', example: 'abc123' })
    @ApiResponse({
        status: 200,
        description: 'Ссылка удалена',
        schema: {
            example: {
                deleted: true,
            },
        },
    })
    remove(@Param('alias') alias: string) {
        return this.linksService.remove(alias);
    }

    @Get(':alias')
    @ApiOperation({ summary: 'Редирект по короткой ссылке' })
    @ApiParam({ name: 'alias', example: 'abc123' })
    @ApiResponse({ status: 302, description: 'Редирект на оригинальный URL' })
    async redirect(
        @Param('alias') alias: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const url = await this.linksService.resolve(alias, req.ip);
        return res.redirect(url);
    }
}
