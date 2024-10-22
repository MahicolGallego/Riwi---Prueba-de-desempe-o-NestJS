import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { Repository } from 'typeorm';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Result } from 'src/results/entities/result.entity';

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

  findAll() {
    return `This action returns all rankings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ranking`;
  }

  remove(id: number) {
    return `This action removes a #${id} ranking`;
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
    console.log(listRankings);
    listRankings.forEach((ranking, index) => {
      ranking.ranking = index + 1;
    });

    Promise.all(
      listRankings.map((ranking) => this.rankingsRepository.save(ranking)),
    );
  }
}
