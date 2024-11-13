import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Result } from 'src/results/entities/result.entity';
import { IRankingfilter } from 'src/common/interfaces/IRankingFilter';
import { UUID } from 'crypto';
import { ErrorManager } from 'src/common/filters/error-manage.filter';

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingsRepository: Repository<Ranking>,
    @Inject(forwardRef(() => TournamentsService))
    private readonly tournamentsService: TournamentsService,
  ) {}
  async create(tournament: Tournament, player: User) {
    await this.tournamentsService.verifyRegisteredPlayers(
      tournament.id,
      player.id,
    );

    const ranking = await this.rankingsRepository.findOne({
      where: { tournament_id: tournament.id, player_id: player.id },
    });

    if (!ranking) {
      const newRanking = this.rankingsRepository.create({
        tournament,
        player,
      });
      return await this.rankingsRepository.insert(newRanking);
    }

    return null;
  }

  async updateRankings(match: Match, result: Result) {
    const { tournament, player1, player2 } = match;
    const rankings = tournament.rankings;

    const player1Ranking = rankings.find((r) => r.player_id === player1.id);
    const player2Ranking = rankings.find((r) => r.player_id === player2.id);

    if (player1.id === result.winner_player_id) {
      player1Ranking.wins++;
      player1Ranking.points += tournament.points_win_match;
      player2Ranking.losses++;
    } else {
      player2Ranking.wins++;
      player2Ranking.points += tournament.points_win_match;
      player1Ranking.losses++;
    }

    await Promise.all([
      this.rankingsRepository.save(player1Ranking),
      this.rankingsRepository.save(player2Ranking),
    ]);

    this.assignedRankingPosition(rankings);
    return rankings;
  }
  assignedRankingPosition(listRankings: Ranking[]) {
    listRankings.sort((a, b) => b.points - a.points);

    listRankings.forEach((ranking, index) => {
      ranking.ranking = index + 1;
    });

    Promise.all(
      listRankings.map((ranking) => this.rankingsRepository.save(ranking)),
    );
  }

  async getLeakedRankings(
    tournament_id: UUID,
    filterforRanking: IRankingfilter,
  ): Promise<object | null> {
    try {
      const { gte_score, lte_score, page } = filterforRanking;
      const take = 3;
      const skip = page ? (page - 1) * take : 0;

      const whereConditions: any = { tournament_id };

      if (gte_score && lte_score) {
        if (gte_score > lte_score) {
          console.log(gte_score, lte_score);
          console.warn(gte_score < lte_score);
          throw new ErrorManager({
            type: 'CONFLICT',
            message:
              'Invalid range: The lower limit cannot be greater than the upper limit',
          });
        }
        whereConditions.points = Between(gte_score, lte_score);
      }

      if (gte_score && !lte_score) {
        whereConditions.points = MoreThanOrEqual(gte_score);
      }

      if (!gte_score && lte_score) {
        whereConditions.points = LessThanOrEqual(lte_score);
      }

      const [items, total] = await this.rankingsRepository.findAndCount({
        where: whereConditions,
        skip,
        take,
        order: {
          ranking: 'ASC',
        },
      });

      if (!items.length) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message:
            'There are not rankins in the database with parameters provided',
        });
      }

      const last_page = Math.ceil(total / take);

      if (page > last_page) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: `Page out of range: requested page ${page}, Total rankings: ${total} , last page ${last_page}. Select a page in range of results`,
        });
      }

      return {
        ranking: items,
        total,
        pages: page ? page : 1,
        last_page: last_page,
      };
    } catch (error) {
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
}
