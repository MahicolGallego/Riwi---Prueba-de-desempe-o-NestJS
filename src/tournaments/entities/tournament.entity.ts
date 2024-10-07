import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Match } from 'src/matches/entities/match.entity';
import { Ranking } from 'src/rankings/entities/ranking.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tournaments')
export class Tournament {
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
  @Column({ type: 'int', nullable: false })
  points_win_match: number;

  @ApiProperty()
  @Expose()
  @Column({ type: 'int', nullable: false })
  points_lose_match: number;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ranking, (ranking) => ranking.tournament)
  rankings: Ranking[];

  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'tournament_players', // table name for the junction table of this relation
    joinColumn: {
      name: 'tournament_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  players: User[];
}
