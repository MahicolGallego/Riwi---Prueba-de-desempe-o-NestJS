import { Injectable } from '@nestjs/common';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';

@Injectable()
export class RankingsService {
  create(createRankingDto: CreateRankingDto) {
    return 'This action adds a new ranking';
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
