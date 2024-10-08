import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  match_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  winner_player_id: string;
}
