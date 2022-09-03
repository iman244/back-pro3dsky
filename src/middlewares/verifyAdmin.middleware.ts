import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Res,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class verifyAdminMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { access_token } = request.cookies;
    if (!access_token) {
      return new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
    }
    jwt.verify(access_token, process.env.PASS_JWT, (error, tokenData) => {
      if (error) {
        response.json(
          new HttpException('you are not authorized', HttpStatus.FORBIDDEN),
        );
      } else if (tokenData && tokenData.isAdmin) {
        next();
      } else {
        response.json(
          new HttpException('you are not authorized', HttpStatus.FORBIDDEN),
        );
      }
    });
  }
}
