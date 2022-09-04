import { Body, Controller, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  token_validate(@Body('access_token') access_token: string) {
    let isAdmin = this.appService.token_validate(access_token);

    return isAdmin;
  }
}
