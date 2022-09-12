import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Design, DesignBody } from './design.type';
import * as fs from 'fs';

@Injectable()
export class DesignService {
  constructor(
    @InjectModel('Design') private readonly DesignModel: Model<Design>,
  ) {}

  async getDesigns(page = 1, limit = 1) {
    try {
      const designs = await this.DesignModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const totalDesigns = await this.DesignModel.countDocuments();

      return { designs, totalDesigns };
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async searchDesigns(keyword: string, page = 1, limit = 1) {
    try {
      let designs = await this.DesignModel.find({
        username: { $regex: keyword, $options: 'i' },
      })
        .limit(limit)
        .skip((page - 1) * limit);

      const totalDesigns = await this.DesignModel.countDocuments({
        username: { $regex: keyword, $options: 'i' },
      });

      return { designs, totalDesigns };
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async saveMongoDBDocument(
    design: DesignBody,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const { name, category, isPremium } = design;
      const fileCount = files.length;
      let keyList = [];
      for (let i = 0; i < fileCount; i++) {
        keyList.push(
          `${name}_${i}.${files[i].mimetype.match(/(?<=\/)[\S\s]*/g)[0]}`,
        );
      }

      return await this.DesignModel.create({
        name,
        category,
        isPremium,
        keyList,
      });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new HttpException('duplicate name', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('error', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async upload(
    name: string,
    keyList: string[],
    files: Array<Express.Multer.File>,
  ) {
    try {
      let resultList = [];
      for (let i = 0; i < keyList.length; i++) {
        const bucketS3 = process.env.BUCKETS3_NAME;

        let result = await this.uploadS3(
          fs.createReadStream(files[i].path),
          bucketS3,
          `${keyList[i]}`,
        );
        resultList.push(result);
      }
      return resultList;
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      ACL: 'public-read',
      Body: file,
    };
    try {
      const data = await s3.send(new PutObjectCommand(params));
      return data;
    } catch (error) {
      console.log('Error', error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
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
