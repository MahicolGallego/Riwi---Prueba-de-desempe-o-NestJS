import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { IRankingfilter } from 'src/common/interfaces/IRankingFilter';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('rankings')
@ApiBearerAuth()
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get tournament rankings',
    description:
      'Retrieve the rankings for a tournament by ID, with optional filters for score range and pagination.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The unique ID of the tournament.',
    type: String,
  })
  @ApiQuery({
    name: 'gte_score',
    required: false,
    description: 'Filter rankings by a minimum score.',
    type: Number,
  })
  @ApiQuery({
    name: 'lte_score',
    required: false,
    description: 'Filter rankings by a maximum score.',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default is 1).',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'A list of rankings for the requested tournament.',
    schema: {
      example: {
        ranking: [
          {
            id: '1',
            player: 'Player 1',
            points: 1500,
            ranking: 1,
          },
          {
            id: '2',
            player: 'Player 2',
            points: 1200,
            ranking: 2,
          },
        ],
        total: 50,
        pages: 1,
        last_page: 17,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid filter or pagination parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'gte_score must be less than or equal to lte_score',
          'page must be a positive integer',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No rankings found for the given tournament ID or filters.',
    schema: {
      example: {
        message:
          'There are no rankings in the database with parameters provided',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
    schema: {
      example: {
        message: 'An unexpected error occurred',
      },
    },
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Query() filterParams: IRankingfilter,
  ) {
    return await this.rankingsService.getLeakedRankings(id, filterParams);
  }
}
