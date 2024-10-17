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
import { User } from 'src/users/entities/user.entity';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private readonly tournamentsService: TournamentsService,
  ) {}
  async createMatches(tournament_id: string) {
    try {
      const tournament = await this.tournamentsService.findOne(tournament_id);

      if (!tournament) {
        throw new NotFoundException(
          `Tournament with id ${tournament_id} not found`,
        );
      }

      const haveMatches = tournament.matches;

      if (haveMatches.length > 0) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'The tournament already has matches',
        });
      }

      const listPlayers = tournament.players;

      if (listPlayers.length === 0) {
        throw new NotFoundException(
          `Tournament with id ${tournament_id} does not have players`,
        );
      }

      if (listPlayers.length === 1) {
        throw new ConflictException(
          'The number of players must be greater than one',
        );
      }

      //randomly generate the matches between all the competitors, 2 times
      //with each competitor, once where it is player 1 and another where it is player 2

      const shuffleListPlayers = this.shuffleTheListPlayers(listPlayers);

      const listMatches: CreateMatchDto[] = [];
      let newMatch: CreateMatchDto;

      for (let i = 0; i < shuffleListPlayers.length; i++) {
        for (let j = 0; j < shuffleListPlayers.length; j++) {
          if (shuffleListPlayers[i].id !== shuffleListPlayers[j].id) {
            // filtrar para saber si el player ya tiene sus 2 juegos con cada jugador
            let quantityplayersMatches: CreateMatchDto[] = [];

            if (listMatches.length > 0) {
              quantityplayersMatches = listMatches.filter(
                (match) =>
                  (match.player_1_id === shuffleListPlayers[i].id &&
                    match.player_2_id === shuffleListPlayers[j].id) ||
                  (match.player_1_id === shuffleListPlayers[j].id &&
                    match.player_2_id === shuffleListPlayers[i].id),
              );
            }

            if (quantityplayersMatches.length < 2) {
              const createMatchDto: CreateMatchDto = new CreateMatchDto();

              if (quantityplayersMatches.length === 0) {
                createMatchDto.player_1_id = shuffleListPlayers[i].id;
                createMatchDto.player_2_id = shuffleListPlayers[j].id;
              }

              if (quantityplayersMatches.length === 1) {
                if (
                  quantityplayersMatches[0].player_1_id ===
                  shuffleListPlayers[i].id
                ) {
                  createMatchDto.player_1_id = shuffleListPlayers[j].id;
                  createMatchDto.player_2_id = shuffleListPlayers[i].id;
                } else {
                  createMatchDto.player_1_id = shuffleListPlayers[i].id;
                  createMatchDto.player_2_id = shuffleListPlayers[j].id;
                }
              }

              newMatch = this.matchesRepository.create({
                ...createMatchDto,
                tournament,
              });

              listMatches.push(newMatch);
            }
          }
        }
      }

      // Promise all para poder obtener el array con los datos resueltos,
      // y no con promesas pendientes como seria solo con .map que no
      // espera la resolucion de las promesas
      const savedMatches = await Promise.all(
        listMatches.map(async (match) => {
          const registeredNewMatch = await this.matchesRepository.save(match);
          // retirar la propiedad torneo con todos sus datos para convertir
          // y retornar solo los datos de match
          const { tournament, ...matchData } = registeredNewMatch;
          return plainToClass(Match, matchData);
        }),
      );

      return savedMatches;
    } catch (err) {
      throw err instanceof Error
        ? ErrorManager.createSignatureError(err.message)
        : err;
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

  shuffleTheListPlayers(listPlayers: User[]) {
    const shuffleListPlayers = new Array(...listPlayers);
    for (let i = 0; i < shuffleListPlayers.length; i++) {
      // Pick a random index from 0 to max length (inclusive)
      const j = Math.floor(Math.random() * shuffleListPlayers.length);

      // using destructuration for swap elements
      [shuffleListPlayers[i], shuffleListPlayers[j]] = [
        shuffleListPlayers[j],
        shuffleListPlayers[i],
      ];
    }
    return shuffleListPlayers;
  }
}
