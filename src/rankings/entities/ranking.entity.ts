import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('rankings')
export class Ranking {
  // Define properties of format responses with users for swagger documentation with @ApiProperty decorator

  // Expose properties for serialization. It will be included in the response when converting the entity to JSON.

  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Expose()
  tournament_id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Expose()
  @Column({ type: 'uuid', nullable: false })
  player_id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'int', nullable: false })
  wins: number;

  @ApiProperty()
  @Expose()
  @Column({ type: 'int', nullable: false })
  losses: number;

  @ApiProperty()
  @Expose()
  @Column({ type: 'int', nullable: false })
  poinst: number;

  @ApiProperty()
  @Expose()
  @Column({ type: 'int', nullable: false })
  ranking: number;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tournament, (tournament) => tournament.rankings)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @ManyToOne(() => User, (user) => user.rankings)
  @JoinColumn({ name: 'player_1' })
  player: User;
}
