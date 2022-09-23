import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly AppService: AppService) {}

  @Get('test')
  hello() {
    return 'this is pro3dsky.com api';
  }

  @Post()
  token_validate(@Body('access_token') access_token: string) {
    let isAdmin = this.AppService.token_validate(access_token);

    return isAdmin;
  }
}
