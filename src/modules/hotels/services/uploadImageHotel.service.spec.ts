import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageHotelService } from './uploadImageHotel.service';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { Hotel } from '@prisma/client';

// Para mockar as funções de fs mmocko o próprio fs
// depois chamo os imports das funções que uso.
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));
import { existsSync, unlinkSync } from 'fs';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

describe('UploadImageHotelService', () => {
  // O quê identifiquei como necessário testar:
  //ok - se chamou o repository com a busca do hotel por id (lança exception?);
  //ok - se, tendo hotel.image, deletou a imagem (se não tem, passou direto?, se tem mas o arquivo não existe quebra?);
  //ok - se chamou o delete do cache do redis;
  //ok - se chamou o repository para persistir o nome do arquivo;
  //ok - se retornou um objeto Hotel.
  // tarefa: testar se haverá erro quando o diretório não for encontrado.

  let service: UploadImageHotelService;
  let hotelsRepository: IHotelRepository;
  let redis: { del: jest.Mock };

  // Para dar mais segurança e unicidade à cada teste
  // usar factories para que seja instanciado um novo objeto
  // para cada teste. Evita que dados modificados em um teste
  // afetem outros testes.
  const hotelMock: Hotel = {
    name: 'peidão',
    description: 'lar peidão',
    address: 'casa da zibronha street',
    price: 50,
    id: 1,
    image: 'imagemMock',
    ownerId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const hotelIdMock = 1;
  const imageFilenameMock = 'imageFilenameMock';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadImageHotelService,
        {
          provide: HOTEL_REPOSITORY,
          useValue: {
            updateHotel: jest.fn(),
            findHotelById: jest.fn().mockResolvedValue(hotelMock),
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: { del: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UploadImageHotelService>(UploadImageHotelService);
    hotelsRepository = module.get<IHotelRepository>(HOTEL_REPOSITORY);
    redis = module.get('default_IORedisModuleConnectionToken');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should search for inexistent hotel and throw exception', async () => {
    (hotelsRepository.findHotelById as jest.Mock).mockResolvedValue(null);

    // O expect deve ser assíncrono enquanto o service deve ser síncrono
    // para que a sua execução ocorra dentro do expect, caso contrário a
    // exception será lançada ants do expect existir.
    await expect(
      service.execute(hotelIdMock, imageFilenameMock),
    ).rejects.toThrow();
  });

  it('should delete image from directory if it exists', async () => {
    // as jest.mock é só para dizer o tipo para o TS.
    (existsSync as jest.Mock).mockReturnValue(true);
    (unlinkSync as jest.Mock).mockReturnValue(() => {});

    await service.execute(hotelIdMock, imageFilenameMock);

    // Para isso funcionar é preciso que tenha alguma string
    // em hotelMock.image.
    expect(existsSync).toHaveBeenCalled();
    expect(unlinkSync).toHaveBeenCalledWith(
      expect.stringContaining(hotelMock.image as string),
    );
  });

  it('should delete cache from Redis', async () => {
    await service.execute(hotelIdMock, imageFilenameMock);

    expect(redis.del).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
  });

  it('should update a hotel with new image and return the same hotel with new image', async () => {
    hotelMock.image = imageFilenameMock;
    (hotelsRepository.updateHotel as jest.Mock).mockResolvedValue(hotelMock);

    const result = await service.execute(hotelIdMock, imageFilenameMock);

    // Atenção com os parâmetros que são passados.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hotelsRepository.updateHotel).toHaveBeenCalledWith(hotelIdMock, {
      image: 'imageFilenameMock',
    });
    expect(result.image).toEqual(imageFilenameMock);
    expect(result.id).toEqual(hotelMock.id);
  });
});
