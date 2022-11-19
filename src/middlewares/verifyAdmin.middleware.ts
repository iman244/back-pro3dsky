import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Role } from 'src/user/users.type';
const jwt = require('jsonwebtoken');

@Injectable()
export class verifyAdminMiddleware implements NestMiddleware {
  use(request: Request, res: Response, next: NextFunction) {
    const { access_token } = request.cookies;
    if (!access_token) {
      throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
    }
    jwt.verify(access_token, process.env.PASS_JWT, (error, tokenData) => {
      if (error) {
        throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
      } else if (tokenData && tokenData.role === Role.ADMIN) {
        next();
      } else {
        throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
      }
    });
  }
}
