import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestLoginDto } from './dto/request-login.dto';
import { RequestUpdateProfileDto } from '../users/dto/request-update-profile.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async login(@Body() dto: RequestLoginDto) {
    return this.authService.login(dto);
  }

  @Post('signup')
  async registration(@Body() dto: RequestUpdateProfileDto) {
    return this.authService.registration(dto);
  }
}
