import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { Link } from './entities/link.entity';
import { Click } from './entities/click.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Link, Click])],
    controllers: [LinksController],
    providers: [LinksService],
})
export class LinksModule {}
