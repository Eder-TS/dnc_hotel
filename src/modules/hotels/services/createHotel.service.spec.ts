import { Test, TestingModule } from '@nestjs/testing';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import { CreateHotelService } from './createHotel.service';
import { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

let service: CreateHotelService;
let hotelsRepository: IHotelRepository;
let redis: { del: jest.Mock };

// Conforme a aula, estou usando o mesmo mock de dados tanto para a entrada
// quanto para a saída do service. Para um teste mais preciso poderia
// usar um mock para cada situação.
const createHotelMock = {
  name: 'peidão',
  description: 'lar peidão',
  address: 'casa da zibronha street',
  price: 50,
  // Zero para ver se o ownerId foi inserido.
  id: 0,
  image: 'undefined',
  ownerId: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ownerIdMock = 1;

describe('CreateHotelService', () => {
  beforeEach(async () => {
    // Funções nativas do nestjs para criar módulos mockados.
    const module: TestingModule = await Test.createTestingModule({
      // Como o CreateHotelService recebe o token de repository e
      // o token do Redis, depois chama estas classes para executar
      // as tarefas, então é preciso mockar isso como providers.
      providers: [
        // Precisa trazer o service que vou testar no provider.
        CreateHotelService,
        {
          provide: HOTEL_REPOSITORY,
          useValue: {
            createHotel: jest.fn().mockResolvedValue(createHotelMock),
          },
        },
        {
          // Este provider do Redis é preciso pesquisar nas docuentações e
          // internet afora pois não existe token explicitamente.
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            del: jest.fn(),
          },
        },
      ],
      // O método createTestingModule precisa ser assíncrono, porém é preciso
      // declarar que ele seja compilado.
    }).compile();

    // Agora que o module foi criado, preciso criar as ferramentas que vão usar ele.
    service = module.get<CreateHotelService>(CreateHotelService);
    hotelsRepository = module.get<IHotelRepository>(HOTEL_REPOSITORY);
    redis = module.get('default_IORedisModuleConnectionToken');
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete the Redis key', async () => {
    const redisSpyDel = jest.spyOn(redis, 'del').mockResolvedValue(1);

    await service.execute(ownerIdMock, createHotelMock);

    expect(redisSpyDel).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
  });

  it('should create a hotel', async () => {
    const hotel = await service.execute(ownerIdMock, createHotelMock);

    // Encadeando os espects para buscar o valor da propriedade que vai ser passado para
    // o método.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hotelsRepository.createHotel).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: 1 }),
    );

    expect(hotel).toEqual(createHotelMock);
  });
});
