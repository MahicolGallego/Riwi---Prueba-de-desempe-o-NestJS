import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { ErrorManager } from 'src/common/filters/error-manage.filter';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    try {
      return await this.tournamentRepository.save(createTournamentDto);
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }

  async findAll(): Promise<Tournament[]> {
    return await this.tournamentRepository.find({
      relations: ['matches', 'rankings'],
    });
  }

  async findOne(id: string): Promise<Tournament> {
    return await this.tournamentRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    await this.tournamentRepository.update(id, updateTournamentDto);
    return this.findOne(id);
  }

  async softRemove(id: string): Promise<Tournament> {
    const tournament = await this.findOne(id); // Verificar que el torneo existe
    await this.tournamentRepository.softRemove(tournament); // Realizar el soft delete
    return tournament; // Retornar el registro eliminado
  }
}
