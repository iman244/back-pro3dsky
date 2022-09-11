import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from './user/users.type';
const jwt = require('jsonwebtoken');

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

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
  async deleteUser(id: string) {
    try {
      const user = await this.UserModel.findByIdAndDelete(id);
      return `delete user ${id}`;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
