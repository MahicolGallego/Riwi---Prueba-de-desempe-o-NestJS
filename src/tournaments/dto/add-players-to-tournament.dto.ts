import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AddPlayersToTournamentDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true }) // Ensures that each element is a string.
  playerIds: string[];
}
