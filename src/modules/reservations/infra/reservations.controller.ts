import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { CreateReservationsService } from '../services/createReservations.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { FindReservationsByIdService } from '../services/findReservationsById.service';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { FindReservationsByUserService } from '../services/findReservationsByUser.service';
import { ReservationsStatus, Role } from '@prisma/client';
import { UpdateReservationsStatusService } from '../services/updateReservationsStatus.service';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorators';

@UseGuards(AuthGuard, RoleGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findReservationsByIdService: FindReservationsByIdService,
    private readonly findReservationsByUserService: FindReservationsByUserService,
    private readonly updateReservationsStatusService: UpdateReservationsStatusService,
  ) {}

  @Roles(Role.USER)
  @Post()
  create(@User('id') userId: number, @Body() body: CreateReservationDto) {
    return this.createReservationsService.execute(userId, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Roles(Role.USER)
  @Get('user')
  findByUser(@User('id') userId: number) {
    return this.findReservationsByUserService.execute(userId);
  }

  @Get(':id')
  findById(@ParamId() id: number) {
    return this.findReservationsByIdService.execute(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@ParamId() id: number, @Body('status') status: ReservationsStatus) {
    return this.updateReservationsStatusService.execute({ id, status });
  }

  // Rota delete não deve existir para manter histórico de dados.
  // @Delete()
}
