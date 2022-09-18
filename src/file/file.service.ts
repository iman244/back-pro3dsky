import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream } from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { Design } from 'src/design/design.type';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  constructor(
    @InjectModel('Design') private readonly DesignModel: Model<Design>,
  ) {}

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

  async retreiveGetObjectCommand(name: string) {
    const s3 = this.getS3();
    const param = { Bucket: process.env.BUCKETS3_NAME, Key: name };

    const data = await s3.send(new GetObjectCommand(param));

    return data.Body as Readable;
  }

  async downloadFromS3(name: string) {
    try {
      let stream = await this.retreiveGetObjectCommand(name);
      const ws = createWriteStream(join(process.cwd(), `/downloads/${name}`));

      stream.pipe(ws);
      console.log('Success');
    } catch (err) {
      console.log('Error', err);
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
