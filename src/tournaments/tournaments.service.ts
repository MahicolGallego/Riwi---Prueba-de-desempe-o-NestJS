import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { In, Repository } from 'typeorm';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { User } from 'src/users/entities/user.entity';
import { AddPlayersToTournamentDto } from './dto/add-players-to-tournament.dto';
import { RankingsService } from 'src/rankings/rankings.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly rankingsServices: RankingsService,
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
      relations: ['matches', 'rankings', 'players'],
    });
  }

  async findOne(id: string): Promise<Tournament> {
    return await this.tournamentRepository.findOneOrFail({
      where: { id },
      relations: ['matches', 'rankings', 'players'],
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

    const registeredNewPlayersToTournament =
      await this.tournamentRepository.save(tournament);

    // Create rankings for new players in the tournament

    tournament.players.map(async (player) => {
      return await this.rankingsServices.create(tournament, player);
    });

    return registeredNewPlayersToTournament; // update tournament with new players
  }

  async verifyRegisteredPlayers(tournament_id: string, player_id: string) {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: tournament_id },
        relations: ['players'],
      });

      if (!tournament) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: `Tournament with id ${tournament_id} not found`,
        });
      }

      const player = tournament.players.find((p) => p.id === player_id);
      if (!player) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: `Player with id ${player_id} not found in tournament ${tournament_id}`,
        });
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
