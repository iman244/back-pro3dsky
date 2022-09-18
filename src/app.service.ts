import { S3Client } from '@aws-sdk/client-s3';
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

  getS3() {
    return new S3Client({
      region: 'default',
      endpoint: process.env.ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
}
