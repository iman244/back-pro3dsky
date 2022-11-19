import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { credentials, User } from 'src/user/users.type';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async login(body: credentials) {
    const { username, password } = body;
    const user = await this.UserModel.findOne({ username });
    const expireHour = 4;
    if (user) {
      let userPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC,
      ).toString(CryptoJS.enc.Utf8);
      if (userPassword === password) {
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.PASS_JWT,
          { expiresIn: 60 * 60 * expireHour },
        );
        return { user: user._doc, token, expireHour };
      } else {
        throw new HttpException('wrong credentials', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('wrong credentials', HttpStatus.FORBIDDEN);
    }
  }
}
