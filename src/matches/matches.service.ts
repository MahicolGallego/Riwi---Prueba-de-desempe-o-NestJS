import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { TournamentsService } from 'src/tournaments/tournaments.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private readonly tournamentsService: TournamentsService,
  ) {}
  async createMatches(tournament_id: string) {
    const tournament = await this.tournamentsService.findOne(tournament_id);

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with id ${tournament_id} not found`,
      );
    }

    const quantityPlayers = tournament.players;

    if (quantityPlayers.length === 0) {
      throw new NotFoundException(
        `Tournament with id ${tournament_id} does not have players`,
      );
    }

    if (quantityPlayers.length % 2 !== 0) {
      throw new ConflictException(
        'The number of players must be even, add or remove players',
      );
    }

    for (let i = 0; i < quantityPlayers.length; i += 2) {
      const createMatchDto = new CreateMatchDto();
      createMatchDto.tournament_id = tournament_id;
      createMatchDto.player_1_id = quantityPlayers[i].id; // Asumiendo que el jugador tiene un campo 'id'
      createMatchDto.player_2_id = quantityPlayers[i + 1].id;

      await this.matchesRepository.save(createMatchDto);
    }
  }

  async findAll(tournament_id: string) {
    const matches = await this.matchesRepository.find({
      where: { tournament_id },
    });

    if (!matches) {
      throw new NotFoundException(
        `Matches of the project with id ${tournament_id} not found`,
      );
    }
    return matches;
  }

  async findOne(id: string) {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }
    return match;
  }
}
