import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { Repository } from 'typeorm';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';

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

      console.log(newRanking);

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

  update(id: number, updateRankingDto: UpdateRankingDto) {
    return `This action updates a #${id} ranking`;
  }

  remove(id: number) {
    return `This action removes a #${id} ranking`;
  }
}
