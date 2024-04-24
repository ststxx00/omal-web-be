import { Role } from 'src/auth/role.enum';

export class CreateUserDto {
  userId: string;
  password: string;
  username: string;
  roles: Role;
}
