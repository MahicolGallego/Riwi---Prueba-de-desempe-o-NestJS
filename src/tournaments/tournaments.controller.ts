import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key/api-key.guard';
import { Tournament } from './entities/tournament.entity';

@ApiTags('tournaments')
@UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return await this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  async findAll(): Promise<Tournament[]> {
    return await this.tournamentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tournament> {
    return await this.tournamentsService.findOne(id); // id is a string (UUID)
  }

  @UseGuards(ApiKeyGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return await this.tournamentsService.update(id, updateTournamentDto);
  }

  @UseGuards(ApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tournamentsService.softRemove(id);
  }
}
