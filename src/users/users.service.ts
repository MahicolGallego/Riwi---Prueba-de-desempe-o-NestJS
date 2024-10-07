import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { hashPassword } from 'src/common/helpers/hash-password.helper';

// Mark the UsersService class as injectable, allowing it to be used in other classes
@Injectable()
export class UsersService {
  //inject dependencies through the constructor
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<object> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      newUser.password = await hashPassword(
        newUser.password,
        this.configService,
      );

      const createdUser = await this.userRepository.save(newUser);

      // Retornar credenciales de acceso despues de crear el usuario
      return this.authService.generateJwtToken(createdUser);
    } catch (error) {
      console.error('Error during user registration:', error);
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
