import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { ResultsModule } from './results/results.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configure the ConfigModule to load environment variables and make it global

    // Set up TypeORM with a dynamic configuration based on environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to retrieve configuration values
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        database: configService.get<string>('DB_NAME'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Specify the path for entity files
        logging: true, // Enable logging of SQL queries (useful for development)
        synchronize: true, // Automatically synchronize the database schema (development only)
        ssl: {
          rejectUnauthorized: false, //Allow non ssl connections(development only)
        },
      }),
    }),
    UsersModule,
    TournamentsModule,
    MatchesModule,
    ResultsModule,
    RankingsModule,
  ],
})
export class AppModule {}
