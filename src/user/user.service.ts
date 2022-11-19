import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { credentials, User } from './users.type';
const CryptoJS = require('crypto-js');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async AllUsersInformation(page: number, limit: number) {
    try {
      const users = await this.UserModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      const decryptedUsers = users.map((user) => {
        const { _id, username, password, role } = user;
        const decryptedPassword = CryptoJS.AES.decrypt(
          password,
          process.env.PASS_SEC,
        ).toString(CryptoJS.enc.Utf8);

        return {
          _id,
          username,
          password: decryptedPassword,
          role,
        };
      });
      const totalUsers = await this.UserModel.countDocuments();

      return { users: decryptedUsers, totalUsers };
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
        password: CryptoJS.AES.encrypt(
          password,
          process.env.PASS_SEC,
        ).toString(),
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, data: credentials) {
    try {
      const { username, password, role } = data;

      const user = await this.UserModel.findByIdAndUpdate(
        id,
        {
          username,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC,
          ).toString(),
          role,
        },
        { new: true },
      );
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

  async searchUsers(keyword: string, page: number, limit: number) {
    try {
      const users = await this.UserModel.find({
        username: { $regex: keyword, $options: 'i' },
      })
        .limit(limit)
        .skip((page - 1) * limit);
      const decryptedUsers = users.map((user) => {
        const { _id, username, password, role } = user;
        const decryptedPassword = CryptoJS.AES.decrypt(
          password,
          process.env.PASS_SEC,
        ).toString(CryptoJS.enc.Utf8);

        return {
          _id,
          username,
          password: decryptedPassword,
          role,
        };
      });
      const totalUsers = await this.UserModel.countDocuments({
        username: { $regex: keyword, $options: 'i' },
      });

      return { users: decryptedUsers, totalUsers };
    } catch (error) {
      console.log(error);

      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
