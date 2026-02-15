import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Hotel, Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import { ICreateHotelData } from 'src/modules/hotels/domain/repositories/IcreateHotel.data';
import { createHotel } from './factories/hotel.factory';

// Lembrar que o Jest não lê o tsconfig, então é preciso configurar
// o jest-e2e.json para que encontre os arquivos nos lugares certos.

// Redis precisa ser mockado aqui.
jest.mock('ioredis', () => {
  const moduleRedis = jest.fn().mockImplementation(() => ({
    // métodos que vou utilizar
    del: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(JSON.stringify([{ key: 'mock-value' }])),
    quit: jest.fn().mockResolvedValue(null),
  }));
  return { __esModule: true, default: moduleRedis, Redis: moduleRedis };
});

describe('Hotels (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let adminUser;
  let normalUser;
  let adminToken: string;
  let normalToken: string;
  const dataCreateHotel: ICreateHotelData = {
    name: 'hotelMock',
    description: 'Mock do hotel',
    address: 'Endereço',
    price: 10,
    ownerId: 0,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Já limpo o banco antes de começar para evitar tropeços e dados "velhos".
    await prisma.reservation.deleteMany({});
    await prisma.hotel.deleteMany({});
    await prisma.user.deleteMany({});

    adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@email.com',
        password: 'senha',
        role: Role.ADMIN,
      },
    });

    const normalUser = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@email.com',
        password: 'senha',
        role: Role.USER,
      },
    });

    adminToken = jwt.sign(
      { sub: adminUser.id, role: Role.ADMIN },
      process.env.JWT_SECRET!,
      { expiresIn: '1h', issuer: 'dnc_hotel', audience: 'users' },
    );

    normalToken = jwt.sign(
      { sub: normalUser.id, role: Role.USER },
      process.env.JWT_SECRET!,
      { expiresIn: '1h', issuer: 'dnc_hotel', audience: 'users' },
    );
  });

  afterAll(async () => {
    await prisma.hotel.deleteMany({});
    await prisma.user.deleteMany({});
    // Preciso especificar o fechamento do Prisma.
    await prisma.$disconnect();
    await app.close();
  });

  it('/hotels GET', async () => {
    await createHotel(prisma, { ownerId: adminUser.id });

    const response = await request(app.getHttpServer())
      .get('/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Isso não funciona pois a resposta do get/hotels vem do redis e aqui o redis
    // está mockado, então devo olhar o mock e esperar aquela resposta, mesclada com a resposta aplicação.
    //expect(response.body).toEqual([]);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(1);
  });

  it('/hotels/:id GET', async () => {
    dataCreateHotel.ownerId = adminUser.id;
    const hotel = await createHotel(prisma, dataCreateHotel);

    const response = await request(app.getHttpServer())
      .get(`/hotels/${hotel.id}`)
      .set('Authorization', `Bearer ${normalToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: hotel.id,
      name: hotel.name,
    });
  });

  it('/hotels POST', async () => {
    const response = await request(app.getHttpServer())
      .post('/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(dataCreateHotel)
      .expect(201);

    expect(response.body).toMatchObject({
      name: dataCreateHotel.name,
      description: dataCreateHotel.description,
      address: dataCreateHotel.address,
      price: dataCreateHotel.price,
      ownerId: adminUser.id,
    });
  });

  it('/hotels/:id PATCH', async () => {
    dataCreateHotel.ownerId = adminUser.id;
    const hotel = await createHotel(prisma, dataCreateHotel);

    const response = await request(app.getHttpServer())
      .patch(`/hotels/${hotel.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Hotel Updated' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: hotel.id,
      name: 'Hotel Updated',
    });
  });

  it('/hotels/images/:hotelId PATCH', async () => {
    dataCreateHotel.ownerId = adminUser.id;
    const hotel = await createHotel(prisma, dataCreateHotel);

    const response = await request(app.getHttpServer())
      .patch(`/hotels/images/${hotel.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('imageHotel', Buffer.from('mock-file-content'), 'mock-file.jpg')
      .expect(200);
  });

  it('hotels/:id DELETE', async () => {
    dataCreateHotel.ownerId = adminUser.id;
    const hotel = await createHotel(prisma, dataCreateHotel);

    await request(app.getHttpServer())
      .delete(`/hotels/${hotel.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
