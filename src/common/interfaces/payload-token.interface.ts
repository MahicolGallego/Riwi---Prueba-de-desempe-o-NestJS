import { Roles } from '../constants/roles.enum';

export interface IPayloadToken {
  sub: string;
  role: Roles;
}
