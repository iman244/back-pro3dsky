import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { credentials, hasToken, User } from 'src/user/users.type';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async login(body: credentials) {
    try {
      const { username, password } = body;
      const user = await this.UserModel.findOne({ username });
      if (user) {
        let userPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC,
        ).toString(CryptoJS.enc.Utf8);
        if (userPassword === password) {
          const token = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.PASS_JWT,
            { expiresIn: 60 * 60 },
          );
          return { user: user._doc, token };
        } else {
          throw new HttpException('wrong credentials', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('wrong credentials', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
