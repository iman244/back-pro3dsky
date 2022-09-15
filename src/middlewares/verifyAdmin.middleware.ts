import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class verifyAdminMiddleware implements NestMiddleware {
  use(request: Request, res: Response, next: NextFunction) {
    const { access_token } = request.cookies;
    if (!access_token) {
      console.log('no access token');
      throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
    }
    jwt.verify(access_token, process.env.PASS_JWT, (error, tokenData) => {
      if (error) {
        console.log('error');

        throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
      } else if (tokenData && tokenData.isAdmin) {
        next();
      } else {
        console.log('no admin');

        throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
      }
    });
  }
}
