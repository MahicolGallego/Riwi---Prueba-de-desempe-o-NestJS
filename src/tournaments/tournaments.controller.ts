import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key/api-key.guard';
import { Tournament } from './entities/tournament.entity';
import { AddPlayersToTournamentDto } from './dto/add-players-to-tournament.dto';

@ApiTags('tournaments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new tournament',
    description: 'Creates a new tournament with the provided details.',
  })
  @ApiCreatedResponse({
    description: 'Tournament successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Ensure the input data is valid.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid API key.',
  })
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return await this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all tournaments',
    description: 'Fetches a list of all tournaments.',
  })
  @ApiOkResponse({
    description: 'List of tournaments retrieved successfully.',
  })
  async findAll(): Promise<Tournament[]> {
    return await this.tournamentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a tournament by ID',
    description: 'Fetches a tournament using its unique ID.',
  })
  @ApiOkResponse({
    description: 'Tournament retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tournament> {
    return await this.tournamentsService.findOne(id); // id is a string (UUID)
  }

  @UseGuards(ApiKeyGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a tournament',
    description: 'Updates an existing tournament with the provided details.',
  })
  @ApiOkResponse({
    description: 'Tournament updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Ensure the input data is valid.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return await this.tournamentsService.update(id, updateTournamentDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Delete a tournament',
    description: 'Deletes a tournament using its unique ID.',
  })
  @ApiOkResponse({
    description: 'Tournament deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found.',
  })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tournamentsService.softRemove(id);
  }

  @UseGuards(ApiKeyGuard)
  @Post(':id/players')
  @ApiOperation({
    summary: 'Add players to a tournament',
    description: 'Adds players to a specified tournament.',
  })
  @ApiOkResponse({
    description: 'Players added to the tournament successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Ensure the input data is valid.',
  })
  async addPlayers(
    @Param('id', ParseUUIDPipe) tournamentId: string,
    @Body() addPlayersDto: AddPlayersToTournamentDto,
  ): Promise<Tournament> {
    return await this.tournamentsService.addPlayerToTournament(
      tournamentId,
      addPlayersDto,
    );
  }
}
