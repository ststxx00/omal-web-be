import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignInDto } from './dto/signIn.dto';
import { Roles } from './decorator/roles.decorator';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.userId, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Roles(Role.Admin)
  @Get('admin-test')
  adminTest() {
    return 'Hello admin!';
  }
}
