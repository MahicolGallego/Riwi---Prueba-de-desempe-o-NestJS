import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { MatchesService } from 'src/matches/matches.service';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    private readonly matchesService: MatchesService,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    const match = await this.matchesService.findOne(createResultDto.match_id);

    if (
      match.player_1_id !== createResultDto.winner_player_id &&
      match.player_2_id !== createResultDto.winner_player_id
    ) {
      throw new NotFoundException(
        'The user who wants to be included as a winner is not participating in the match',
      );
    }

    const result = this.resultsRepository.create(createResultDto);
    return await this.resultsRepository.save(result);
  }
}
