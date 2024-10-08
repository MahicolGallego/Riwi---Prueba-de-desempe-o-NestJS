import { Controller, Get, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post(':tournament_id')
  async create(@Param('tournament_id', ParseUUIDPipe) tournament_id: string) {
    return await this.matchesService.createMatches(tournament_id);
  }

  @Get(':tournament_id/all')
  async findAll(@Param('tournament_id', ParseUUIDPipe) tournament_id: string) {
    return await this.matchesService.findAll(tournament_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.findOne(id);
  }
}
