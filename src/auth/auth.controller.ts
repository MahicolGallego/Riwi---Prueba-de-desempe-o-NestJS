import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

ApiTags('auth');
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Register a new user by providing the necessary information in the request body.',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Ensure the input data is valid.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @UseGuards(AuthGuard('localStrategy'))
  @Post('login')
  @ApiOperation({
    summary: 'Login an existing user',
    description: 'Authenticate a user and return a JWT token.',
  })
  @ApiCreatedResponse({
    description: 'Successfully logged in and JWT token generated.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid credentials.',
  })
  login(@Req() req: Request) {
    const user = req.user as User;
    const jwtAndUser = this.authService.generateJwtToken(user);
    return jwtAndUser;
  }
}
