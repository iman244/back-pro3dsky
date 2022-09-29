import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
      maxAge: 60 * 60 * 24 * 24,
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
      // domain: '127.0.0.1',
      domain: 'pro3dsky.com',
    });
    return data.user;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', 'expired', {
      maxAge: 0,
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
      // domain: '127.0.0.1',
      domain: 'pro3dsky.com',
    });

    return { message: 'logoutSuccessfully' };
  }
}
