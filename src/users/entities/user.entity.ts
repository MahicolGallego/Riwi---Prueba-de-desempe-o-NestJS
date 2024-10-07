import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Roles } from 'src/common/constants/roles.enum';
import { Match } from 'src/matches/entities/match.entity';
import { Ranking } from 'src/rankings/entities/ranking.entity';
import { Result } from 'src/results/entities/result.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // Define properties of format responses with users for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  // Expose properties for serialization. It will be included in the response when converting the entity to JSON.
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', unique: true, length: 30, nullable: false })
  email: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'enum', enum: Roles, default: Roles.player })
  role: Roles;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty()
  @Expose()
  @Column({
    type: 'varchar',
    unique: true,
    length: 40,
    nullable: false,
    default: 'Not applicable',
  })
  api_key: string;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  // relationship
  @OneToMany(() => Result, (result) => result.winner_player)
  won_games: Result[];

  @OneToMany(() => Ranking, (ranking) => ranking.player)
  rankings: Ranking[];

  @OneToMany(() => Match, (match) => match.player1)
  matchesAsPlayer1: Match[];

  @OneToMany(() => Match, (match) => match.player2)
  matchesAsPlayer2: Match[];

  @ManyToMany(() => Tournament, (tournament) => tournament.players)
  tournaments: Tournament[];
}
