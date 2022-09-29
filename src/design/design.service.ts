import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Design, DesignBody } from './design.type';
import * as fs from 'fs';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

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

  async searchDesigns(
    name: string,
    isPremium: boolean,
    category: string,
    page = 1,
    limit = 1,
  ) {
    try {
      let designs = await this.DesignModel.find({
        name: { $regex: name, $options: 'i' },
        isPremium: isPremium ? isPremium : { $in: [true, false] },
        category: category
          ? { $regex: category, $options: 'i' }
          : {
              $in: [
                'architecture',
                'furniture',
                'decoration',
                'material',
                'lighting',
                'kitchen',
                'bathroom',
                'plants',
                'other',
              ],
            },
      })
        .limit(limit)
        .skip((page - 1) * limit);

      const totalDesigns = await this.DesignModel.countDocuments({
        name: { $regex: name, $options: 'i' },
        isPremium: isPremium ? isPremium : { $in: [true, false] },
        category: category
          ? { $regex: category, $options: 'i' }
          : {
              $in: [
                'architecture',
                'furniture',
                'decoration',
                'material',
                'lighting',
                'kitchen',
                'bathroom',
                'plants',
                'other',
              ],
            },
      });

      return { designs, totalDesigns };
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async findDesign(id: string) {
    try {
      const design = await this.DesignModel.findById(id);
      if (!design) {
        throw new HttpException(
          'no user with this id found',
          HttpStatus.NOT_FOUND,
        );
      }
      return design;
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException(
          'no user with this id found',
          HttpStatus.NOT_FOUND,
        );
      }
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

  async mongoDBDocumentwithNumber(design: DesignBody, number: number) {
    try {
      const { name, category, isPremium } = design;
      let keyList = [];
      for (let i = 0; i < number; i++) {
        keyList.push(`${name}_${i}`);
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

  async updateMongoDBDocument(
    id: string,
    design: DesignBody,
    files: Array<Express.Multer.File> = [],
  ) {
    try {
      const { name, category, isPremium } = design;
      const fileCount = files.length;
      let keyList: string[] = [];
      for (let i = 0; i < fileCount; i++) {
        keyList.push(
          `${name}_${i}.${files[i].mimetype.match(/(?<=\/)[\S\s]*/g)[0]}`,
        );
      }

      let query: {
        name: string;
        category: string;
        isPremium: boolean;
        keyList?: string[];
      } = { name, category, isPremium };
      if (keyList.length) {
        query.keyList = keyList;
      }

      return await this.DesignModel.findByIdAndUpdate(id, query, { new: true });
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
    ACL: string,
  ) {
    try {
      let resultList = [];
      for (let i = 0; i < keyList.length; i++) {
        const bucketS3 = process.env.BUCKETS3_NAME;

        let result = await this.uploadS3(
          fs.createReadStream(files[i].path),
          bucketS3,
          `${keyList[i]}`,
          ACL,
        );
        resultList.push(result);
      }
      return resultList;
    } catch (error) {
      console.log(error);
      throw new HttpException('no file to upload', HttpStatus.LENGTH_REQUIRED);
    }
  }

  async uploadS3(file, bucket, name, ACL: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      ACL,
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

  async getUploadSignedURL(name: string) {
    try {
      const s3 = this.getS3();

      const UploadpreSignedParams = {
        Bucket: process.env.BUCKETS3_NAME,
        Key: `${name}_0.rar`,
        Conditions: [{ acl: 'private' }, { bucket: process.env.BUCKETS3_NAME }],
        Fields: {
          acl: 'private',
        },
        Expires: 600, //Seconds before the presigned post expires. 3600 by default.
      };

      const { url, fields } = await createPresignedPost(
        s3,
        UploadpreSignedParams,
      );

      return { url, fields };
    } catch (err) {
      console.log('Error creating UPLOAD presigned URL', err);
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

  async deleteObjectInS3(bucket, name) {
    try {
      const s3 = this.getS3();
      const params = {
        Bucket: bucket,
        Key: String(name),
        // VersionId: 'version2.2',
      };
      const data = await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      throw new HttpException(
        'error in deleteObjectInS3',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDesign(id: string) {
    try {
      const bucketS3 = process.env.BUCKETS3_NAME;
      let mongoDBDocument = await this.DesignModel.findById(id);
      const { name, keyList } = mongoDBDocument;
      let resultList = [];
      for (let i = 0; i < keyList.length; i++) {
        let result = await this.deleteObjectInS3(bucketS3, keyList[i]);
        resultList.push(result);
      }

      let deleteRARFile = await this.deleteObjectInS3(
        bucketS3,
        `${name}_0.rar`,
      );

      await this.DesignModel.findByIdAndRemove(id);

      return 'design delete successfully';
    } catch (error) {
      throw new HttpException('error in delete design', HttpStatus.BAD_REQUEST);
    }
  }
}
