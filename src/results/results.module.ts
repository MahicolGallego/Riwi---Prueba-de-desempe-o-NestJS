import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { MatchesModule } from 'src/matches/matches.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Result]),
    MatchesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
