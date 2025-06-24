import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { Click } from './entities/click.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import * as process from 'node:process';

function makeId(length: number = 10) {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }

    return result;
}

@Injectable()
export class LinksService {
    private readonly baseUrl = process.env.BASE_URL || 'http://localhost:8000';

    constructor(
        @InjectRepository(Link) private linksRepo: Repository<Link>,
        @InjectRepository(Click) private clicksRepo: Repository<Click>,
    ) {}

    async index() {
        const aliases = await this.linksRepo.find({ select: ['alias'] });

        return aliases.map((a) => `${this.baseUrl}/${a.alias}`);
    }

    async create(dto: CreateLinkDto): Promise<{ shortUrl: string }> {
        const alias = dto.alias || makeId();

        const exists = await this.linksRepo.existsBy({ alias });

        if (exists) {
            throw new ConflictException('Alias already in use');
        }

        const link = this.linksRepo.create({
            alias,
            originalUrl: dto.originalUrl,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        });

        await this.linksRepo.save(link);

        return { shortUrl: `${this.baseUrl}/${alias}` };
    }

    async resolve(alias: string, ip: string | undefined): Promise<string> {
        const link = await this.linksRepo.findOne({ where: { alias } });

        if (
            !link ||
            (link.expiresAt && link.expiresAt.getTime() < Date.now())
        ) {
            throw new NotFoundException('Short URL not found');
        }

        const click = this.clicksRepo.create({ link, ip });

        await this.clicksRepo.save(click);

        return link.originalUrl;
    }

    async info(alias: string): Promise<Link> {
        const link = await this.linksRepo.findOne({
            where: { alias },
            relations: ['clicks'],
        });

        if (!link) {
            throw new NotFoundException();
        }

        return {
            ...link,
            clickCount: link.clicks?.length,
        };
    }

    async analytics(alias: string) {
        const link = await this.linksRepo.findOne({
            where: { alias },
            relations: ['clicks'],
        });

        if (!link) {
            throw new NotFoundException();
        }

        const lastClicks = link.clicks
            .sort((a, b) => b.clickedAt.getTime() - a.clickedAt.getTime())
            .slice(0, 5);

        return {
            clickCount: link.clicks?.length,
            lastIps: lastClicks.map((c) => c.ip),
        };
    }

    async remove(alias: string) {
        const { affected } = await this.linksRepo.delete({ alias });

        if (!affected) {
            throw new NotFoundException();
        }

        return { deleted: true };
    }
}
