import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Result } from 'src/results/entities/result.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
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

@Entity('matches')
export class Match {
  // Define properties of format responses with users for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  // Expose properties for serialization. It will be included in the response when converting the entity to JSON.
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'uuid', nullable: false })
  tournament_id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'uuid', nullable: false })
  player_1_id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'uuid', nullable: false })
  player_2_id: string;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @ManyToOne(() => User, (user) => user.matchesAsPlayer1)
  @JoinColumn({ name: 'player_1_id' })
  player1: User;

  @ManyToOne(() => User, (user) => user.matchesAsPlayer2)
  @JoinColumn({ name: 'player_2_id' })
  player2: User;

  @OneToOne(() => Result, (result) => result.match)
  result: Result;
}
