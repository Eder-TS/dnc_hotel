import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { CreateHotelService } from '../services/createHotel.service';
import { UpdateHotelService } from '../services/updateHotel.service';
import { RemoveHotelService } from '../services/removeHotel.service';
import { FindAllHotelService } from '../services/findAllHotel.service';
import { FindHotelByIdService } from '../services/findHotelById.service';
import { FindHotelByNameService } from '../services/findHotelByName.service';
import { FindHotelByOwnerService } from '../services/findHotelByOwner.service';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorators';
import { Role } from '@prisma/client';
import { OwnerHotelGuard } from 'src/shared/guards/ownerHotel.guard';
import { User } from 'src/shared/decorators/user.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelService: CreateHotelService,
    private readonly findAllHotelService: FindAllHotelService,
    private readonly findHotelById: FindHotelByIdService,
    private readonly findHotelByName: FindHotelByNameService,
    private readonly findHotelByOwner: FindHotelByOwnerService,
    private readonly removeHotelService: RemoveHotelService,
    private readonly updateHotelService: UpdateHotelService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@User('id') ownerId: number, @Body() createHotelDto: CreateHotelDto) {
    return this.createHotelService.execute(ownerId, createHotelDto);
  }

  // Rota: localhost:3000/hotels <- retorna tudo
  // Rota: localhost:3000/hotels?page=x&limit=y <- retorna a página com olimite dado.
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll(@Query() query) {
    const page = query.page;
    const limit = query.limit;
    return this.findAllHotelService.execute({ page, limit });
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('name')
  findByName(@Query('name') name: string) {
    return this.findHotelByName.execute(name);
  }

  @Roles(Role.ADMIN)
  @Get('owner')
  findByOwner(@User('id') id: number) {
    return this.findHotelByOwner.execute(id);
  }

  // As rotas que recebem id como parâmetros devem ficar abaixo daquelas estáticas e que recebem owner
  // para não haver conflitos.
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findById(@ParamId('id') id: number) {
    return this.findHotelById.execute(id);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.updateHotelService.execute(+id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeHotelService.execute(+id);
  }
}
