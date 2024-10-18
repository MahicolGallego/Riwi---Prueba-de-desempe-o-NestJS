import { forwardRef, Module } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { TournamentsModule } from 'src/tournaments/tournaments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ranking]),
    forwardRef(() => TournamentsModule),
  ],
  controllers: [RankingsController],
  providers: [RankingsService],
  exports: [RankingsService], // Export RankingsService for use in other modules that import this module
})
export class RankingsModule {}
