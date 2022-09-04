import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class AppService {
  token_validate(access_token: string): Object {
    if (!access_token) {
      throw new HttpException('you are not authorized', HttpStatus.FORBIDDEN);
    }
    let isAdmin = jwt.verify(
      access_token,
      process.env.PASS_JWT,
      (error, tokenData) => {
        if (error) {
          throw new HttpException(
            'you are not authorized',
            HttpStatus.FORBIDDEN,
          );
        } else {
          return tokenData.isAdmin;
        }
      },
    );
    return isAdmin;
  }
}
