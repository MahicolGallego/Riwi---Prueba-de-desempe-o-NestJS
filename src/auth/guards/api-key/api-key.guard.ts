import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Roles } from 'src/common/constants/roles.enum';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  //inject dependencies through the constructor
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('findByApiKey', this.usersService);
      // Get the request object from the current execution context
      const request = context.switchToHttp().getRequest();

      // Extract the user api key from the request headers
      const userApiKey = request.headers['x-api-key'];

      // Throw error if no user api key is provided in the request headers or if the api key is not applicable (Not applicable)
      // for avoid security issues
      if (!userApiKey || userApiKey === 'Not applicable') {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'No provided user api key',
        });
      }
      // Find the user associated with the provided user api key
      const foundUser = await this.usersService.findByApiKey(userApiKey);
      // Throw error if the user associated with the provided api key does not exist
      if (!foundUser) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid user api key',
        });
      }

      if (foundUser.role !== Roles.admin)
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: `${foundUser.role} does not have sufficient permissions for performing this action}`,
        });

      return true;
    } catch (error) {
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
