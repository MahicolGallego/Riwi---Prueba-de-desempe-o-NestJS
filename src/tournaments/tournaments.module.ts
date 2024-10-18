import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { RankingsModule } from 'src/rankings/rankings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, User]),
    AuthModule,
    UsersModule,
    RankingsModule,
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService], // Export TournamentsService for use in other modules that import this module
})
export class TournamentsModule {}
