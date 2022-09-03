import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { credentials, User } from './users.type';
const CryptoJS = require('crypto-js');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async AllUsersInformation() {
    try {
      const users = await this.UserModel.find();
      return users;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async register(body: credentials): Promise<Object> {
    try {
      const { password, ...otherCredentials } = body;
      const user = await this.UserModel.create({
        ...otherCredentials,
        password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC),
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string) {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
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

  async UserInformation(id: string) {
    try {
      const user = await this.UserModel.findOne({ id });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
