import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DesignService } from './design.service';
import { DesignBody } from './design.type';

@Controller('designs')
export class DesignController {
  constructor(private readonly DesignService: DesignService) {}

  @Get()
  async getDesigns(
    @Query('name') name: string,
    @Query('isPremium') isPremium: boolean,
    @Query('category') category: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (!name && !isPremium && !category) {
      return await this.DesignService.getDesigns(page, limit);
    } else {
      return this.DesignService.searchDesigns(
        name,
        isPremium,
        category,
        page,
        limit,
      );
    }
  }

  @Get(':id')
  async findDesign(@Param('id') id: string) {
    return await this.DesignService.findDesign(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'rarFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, 'uploads');
          },
          filename: (req, file, cb) => {
            cb(null, file.originalname);
          },
        }),
      },
    ),
  )
  async upload(
    @Body() DesignBody: DesignBody,
    @UploadedFiles()
    files: { images: Express.Multer.File[]; rarFile: Express.Multer.File[] },
  ) {
    console.log(files);

    const mongoDBDocument = await this.DesignService.saveMongoDBDocument(
      DesignBody,
      files.images,
    );

    const { name, keyList } = mongoDBDocument;

    let uploadImages = await this.DesignService.upload(
      name,
      keyList,
      files.images,
      'public-read',
    );

    let RARkeyList = [];
    for (let i = 0; i < files.rarFile.length; i++) {
      RARkeyList.push(`${name}_${i}.rar`);
    }

    let uploadRARs = await this.DesignService.upload(
      name,
      RARkeyList,
      files.rarFile,
      'private',
    );

    return 'uploaded successfully';
  }

  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'rarFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, 'uploads');
          },
          filename: (req, file, cb) => {
            cb(null, file.originalname);
          },
        }),
      },
    ),
  )
  async updateDesign(
    @Param('id') id: string,
    @Body() DesignBody: DesignBody,
    files: { images: Express.Multer.File[]; rarFile: Express.Multer.File[] },
  ) {
    const mongoDBDocument = await this.DesignService.updateMongoDBDocument(
      id,
      DesignBody,
      files.images,
    );

    const { name, keyList } = mongoDBDocument;

    if (files.images.length) {
      console.log('we are in files', files.images.length);
      let a = await this.DesignService.upload(
        name,
        keyList,
        files.images,
        'public-read',
      );
    }

    if (files.rarFile.length) {
      let RARkeyList = [];
      for (let i = 0; i < files.rarFile.length; i++) {
        RARkeyList.push(`${name}_${i}.rar`);
      }

      let uploadRARs = await this.DesignService.upload(
        name,
        RARkeyList,
        files.rarFile,
        'private',
      );
    }

    return 'updated successfully';
  }

  @Delete('delete/:id')
  async deleteDesign(@Param('id') id: string) {
    return this.DesignService.deleteDesign(id);
  }
}
