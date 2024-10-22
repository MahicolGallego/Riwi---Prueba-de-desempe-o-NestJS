import { Controller, Get, Param, Delete } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  findAll() {
    return this.rankingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankingsService.remove(+id);
  }
}
