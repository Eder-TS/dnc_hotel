import { Test, TestingModule } from '@nestjs/testing';
import { FindAllHotelService } from './findAllHotel.service';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';
import { Hotel } from '@prisma/client';

let service: FindAllHotelService;
let hotelsRepository: IHotelRepository;
let redis: {
  get: jest.Mock;
  set: jest.Mock;
};

const hotelMock: Hotel = {
  name: 'peidão',
  description: 'lar peidão',
  address: 'casa da zibronha street',
  price: 50,
  id: 0,
  image: 'undefined',
  ownerId: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const totalHotelsMock = 1;

describe('FindAllHotelService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllHotelService,
        {
          provide: HOTEL_REPOSITORY,
          useValue: {
            // Dizendo que a função do repositório retorna o mock.
            // Aqui está diferente da aula pois meu retorno no repositório foi otimizado.
            findHotels: jest.fn().mockResolvedValue({
              hotels: [hotelMock],
              totalHotels: totalHotelsMock,
            }),
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          // Adicionar as duas funções possívei no mesmo provider.
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindAllHotelService>(FindAllHotelService);
    hotelsRepository = module.get<IHotelRepository>(HOTEL_REPOSITORY);
    redis = module.get('default_IORedisModuleConnectionToken');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return hotels from Redis if available', async () => {
    const hotelsFromRedis = [hotelMock];

    // get é a função que o jest está mockando, e mockResolvedValue vai dar o
    // retorno desta função.
    redis.get.mockResolvedValue(JSON.stringify(hotelsFromRedis));

    const result = await service.execute({ page: 1, limit: 10 });

    // Professor fez esta manobra po algum problema com a data
    // que precisa estar fixa.
    result.data.forEach((hotel) => {
      hotel.createdAt = new Date(hotel.createdAt);
      hotel.updatedAt = new Date(hotel.updatedAt);
    });

    expect(redis.get).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
    // Deve ser igual a hotelsFromRedis pois este é um array que é o
    // retorno do service em data.
    expect(result.data).toEqual(hotelsFromRedis);
  });

  it('should fecth hotels from repository if not in Redis and cache then', async () => {
    // Função irá retornar null.
    redis.get.mockResolvedValue(null);

    const page = 1;
    const limit = 10;
    const result = await service.execute({ page, limit });
    const offset = (page - 1) * limit;

    expect(redis.get).toHaveBeenCalledWith(REDIS_HOTEL_KEY);

    // Eslint pode ser ajustado para não reclamar nos testes.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hotelsRepository.findHotels).toHaveBeenCalledWith(offset, limit);
    expect(redis.set).toHaveBeenCalledWith(
      REDIS_HOTEL_KEY,
      JSON.stringify([hotelMock]),
    );
    expect(result.data).toEqual([hotelMock]);
    expect(result.total).toEqual(totalHotelsMock);

    // Verificando o formato do objeto.
    expect(result).toEqual({
      total: totalHotelsMock,
      page: page,
      per_page: limit,
      data: [hotelMock],
    });
  });

  it('should return the correct pagination metadata', async () => {
    redis.get.mockResolvedValue(null);

    const page = 2;
    const limit = 5;
    const result = await service.execute({ page, limit });
    const offset = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hotelsRepository.findHotels).toHaveBeenCalledWith(offset, limit);
    expect(result.page).toEqual(page);
    expect(result.per_page).toEqual(limit);
  });
});
