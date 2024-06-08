import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { bcryptSaltRounds } from 'src/auth/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    userId: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUserId(userId);
    const validationResult = await bcrypt.compare(pass, user.password);
    if (!validationResult) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.userId,
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
