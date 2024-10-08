import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Match } from 'src/matches/entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('results')
export class Result {
  // Define properties of format responses with users for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  // Expose properties for serialization. It will be included in the response when converting the entity to JSON.
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'uuid', nullable: false })
  match_id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'uuid', nullable: false })
  winner_player_id: string;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: number;

  @ManyToOne(() => User, (user) => user.won_games)
  @JoinColumn({ name: 'winner_player_id' })
  winner_player: User;

  @OneToOne(() => Match, (match) => match.results)
  @JoinColumn({ name: 'match_id' })
  match: Match;
}
