import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { Result } from './entities/result.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key/api-key.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new match result',
    description:
      'Create a result for a match by providing the match ID and the winner player ID. Requires JWT authentication and a valid API key.',
  })
  @ApiCreatedResponse({
    description: 'The result has been successfully created.',
    type: Result,
  })
  @ApiNotFoundResponse({
    description: 'Match not found. Ensure the match ID is correct.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Ensure the input data is valid.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Ensure your API key and JWT token are valid.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden. You do not have permission to perform this action.',
  })
  async create(@Body() createResultDto: CreateResultDto): Promise<Result> {
    return await this.resultsService.create(createResultDto);
  }
}
