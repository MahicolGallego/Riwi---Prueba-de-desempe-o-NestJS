import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({
    description: 'The ID of the tournament to which the match belongs',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  tournament_id: string;

  @ApiProperty({
    description: 'The ID of the first player',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  player_1_id: string;

  @ApiProperty({
    description: 'The ID of the second player',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  player_2_id: string;
}
