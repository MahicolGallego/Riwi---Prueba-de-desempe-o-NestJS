import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { In, Repository } from 'typeorm';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { User } from 'src/users/entities/user.entity';
import { AddPlayersToTournamentDto } from './dto/add-players-to-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return await this.tournamentRepository.findOneOrFail({
      where: { id },
      relations: ['matches', 'rankings'],
    });
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

  async addPlayerToTournament(
    tournamentId: string,
    addPlayersDto: AddPlayersToTournamentDto,
  ): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ['players'],
    });

    if (!tournament) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: `Tournament with id ${tournamentId} not found`,
      });
    }

    const newPlayers = await this.usersRepository.find({
      where: { id: In(addPlayersDto.playerIds) },
    });

    tournament.players = [...tournament.players, ...newPlayers]; // add new players

    return await this.tournamentRepository.save(tournament); // update tournament with new players
  }
}
