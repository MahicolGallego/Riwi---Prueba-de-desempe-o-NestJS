import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTournamentDto {
  @ApiProperty({
    description: 'The name of the tournament',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Points awarded for winning a match',
  })
  @IsInt()
  @IsNotEmpty()
  points_win_match: number;
}
