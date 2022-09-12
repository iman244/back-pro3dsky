import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DesignService } from './design.service';
import { DesignBody } from './design.type';

@Controller('design')
export class DesignController {
  constructor(private readonly DesignService: DesignService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads');
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async upload(
    @Body() DesignBody: DesignBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const mongoDBDocument = await this.DesignService.saveMongoDBDocument(
      DesignBody,
      files,
    );

    const { name, keyList } = mongoDBDocument;

    let a = await this.DesignService.upload(name, keyList, files);
    console.log(a);
    return 'we are in test';
  }
}
