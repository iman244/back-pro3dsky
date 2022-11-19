import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from 'src/user/users.type';
import { FileService } from './file.service';
const jwt = require('jsonwebtoken');

@Controller('file')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Get(':id')
  async getSignedURL(@Param('id') id: string, @Req() request: Request) {
    const { access_token } = request.cookies;
    const { name, isPremium } = await this.FileService.findDesign(id);
    const email = 'mailto:pro3dsky@gmail.com';

    let preSignedURL = await jwt.verify(
      access_token,
      process.env.PASS_JWT,
      async (error, tokenData) => {
        if (error) {
          console.log('error');
          console.log(error);
          return email;
        } else if (tokenData) {
          console.log('token data');
          if (tokenData.role === Role.ADMIN || tokenData.role === Role.PRO) {
            console.log('admin or pro');
            const preSignedURL = await this.FileService.getPreSignedURL(
              `${name}.rar`,
            );
            return preSignedURL;
          } else if (tokenData.role === Role.FREE) {
            console.log('free');
            if (isPremium) {
              console.log('free wants pro item');
              return email;
            } else {
              console.log('free download free item');
              const preSignedURL = await this.FileService.getPreSignedURL(
                `${name}.rar`,
              );
              return preSignedURL;
            }
          } else {
            console.log('anonymos');
            return email;
          }
        } else {
          console.log('no error no token data');
          return email;
        }
      },
    );
    return { preSignedURL };
  }
}
