import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Links (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, transform: true }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const aliasOf = (shortUrl: string) => new URL(shortUrl).pathname.slice(1);

    it('создаёт ссылку c пользовательским alias', async () => {
        const dto = {
            originalUrl: 'https://google.com',
            alias: 'ggl',
        };

        const createRes = await request(app.getHttpServer())
            .post('/shorten')
            .send(dto)
            .expect(201);

        const { body } = createRes as { body: { shortUrl: string } };

        expect(body).toHaveProperty('shortUrl');
        expect(aliasOf(body.shortUrl)).toBe(dto.alias);
    });

    it('отказывает при повторном использовании того же alias', async () => {
        const dto = {
            originalUrl: 'https://example.com',
            alias: 'ggl',
        };

        await request(app.getHttpServer())
            .post('/shorten')
            .send(dto)
            .expect(409);
    });

    it('редиректит на оригинальный URL', async () => {
        const createRes = await request(app.getHttpServer())
            .post('/shorten')
            .send({ originalUrl: 'https://github.com' })
            .expect(201);

        const { shortUrl } = createRes.body as { shortUrl: string };
        const alias = aliasOf(shortUrl);

        await request(app.getHttpServer())
            .get(`/${alias}`)
            .expect(302)
            .expect('Location', 'https://github.com');
    });

    it('удаляет ссылку', async () => {
        const createRes = await request(app.getHttpServer())
            .post('/shorten')
            .send({ originalUrl: 'https://github.com' })
            .expect(201);

        const { shortUrl } = createRes.body as { shortUrl: string };
        const alias = aliasOf(shortUrl);

        const deleteRes = await request(app.getHttpServer())
            .delete(`/delete/${alias}`)
            .expect(200);

        expect(deleteRes.body).toEqual({ deleted: true });
    });

    it('возвращает информацию о ссылке', async () => {
        const createRes = await request(app.getHttpServer())
            .post('/shorten')
            .send({ originalUrl: 'https://github.com' })
            .expect(201);

        const { shortUrl } = createRes.body as { shortUrl: string };
        const alias = aliasOf(shortUrl);

        const infoRes = await request(app.getHttpServer())
            .get(`/info/${alias}`)
            .expect(200);

        expect(infoRes.body).toEqual({
            originalUrl: 'https://github.com',
            createdAt: expect.any(String) as string,
            clickCount: expect.any(Number) as number,
        });
    });
});
