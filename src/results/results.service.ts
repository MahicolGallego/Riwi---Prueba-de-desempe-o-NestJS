import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { MatchesService } from 'src/matches/matches.service';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { RankingsService } from 'src/rankings/rankings.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    private readonly matchesService: MatchesService,
    private readonly rankingsService: RankingsService,
  ) {}

  async create(createResultDto: CreateResultDto) {
    const match = await this.matchesService.findOne(createResultDto.match_id);

    if (match.result) {
      throw new ErrorManager({
        type: 'CONFLICT',
        message: 'The match has already a assigned result',
      });
    }
    console.log(match);
    if (
      match.player_1_id !== createResultDto.winner_player_id &&
      match.player_2_id !== createResultDto.winner_player_id
    ) {
      throw new NotFoundException(
        'The user who wants to be included as a winner is not participating in the match',
      );
    }

    let createResult;
    if (match.player_1_id === createResultDto.winner_player_id) {
      createResult = this.resultsRepository.create({
        match: match,
        winner_player: match.player1,
      });
    } else {
      createResult = this.resultsRepository.create({
        match: match,
        winner_player: match.player2,
      });
    }
    const newResult = await this.resultsRepository.save(createResult);

    // searching for the match again after register its result for update
    // rankings of players
    const matchAfterAssingResult = await this.matchesService.findOne(
      createResultDto.match_id,
    );

    // udpate ranking clasification and its data

    await this.rankingsService.updateRankings(
      matchAfterAssingResult,
      matchAfterAssingResult.result,
    );

    return {
      message:
        'Created and assigned new result and updated tournament rankings successfully',
      result: plainToClass(Result, newResult),
    };
  }
}
