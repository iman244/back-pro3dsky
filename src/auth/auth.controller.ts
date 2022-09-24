import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { credentials } from 'src/user/users.type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: credentials,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.AuthService.login(body);
    response.cookie('access_token', data.token, {
      maxAge: 60 * 60 * 24 * 1000 * 1000 * 1000,
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
      domain: 'pro3dsky.com',
    });
    return data.user;
  }
}
