import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DesignService } from './design.service';
import { DesignBody } from './design.type';

@Controller('designs')
export class DesignController {
  constructor(private readonly DesignService: DesignService) {}

  @Get()
  async getDesigns(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (!keyword) {
      return await this.DesignService.getDesigns(page, limit);
    } else {
      return this.DesignService.searchDesigns(keyword, page, limit);
    }
  }

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

    return 'uploaded successfully';
  }
}
