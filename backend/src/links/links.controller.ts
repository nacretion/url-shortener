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

@Controller()
export class LinksController {
    constructor(private readonly linksService: LinksService) {}

    @Get('all')
    index() {
        return this.linksService.index();
    }

    @Post('shorten')
    @HttpCode(201)
    shorten(@Body() dto: CreateLinkDto) {
        return this.linksService.create(dto);
    }

    @Get('info/:alias')
    async info(@Param('alias') alias: string) {
        const { originalUrl, createdAt, clickCount } =
            await this.linksService.info(alias);

        return { originalUrl, createdAt, clickCount };
    }

    @Get('analytics/:alias')
    analytics(@Param('alias') alias: string) {
        return this.linksService.analytics(alias);
    }

    @Delete('delete/:alias')
    remove(@Param('alias') alias: string) {
        return this.linksService.remove(alias);
    }

    @Get(':alias')
    async redirect(
        @Param('alias') alias: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const url = await this.linksService.resolve(alias, req.ip);
        return res.redirect(url);
    }
}
