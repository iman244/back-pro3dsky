import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
    @Query('name') name: string,
    @Query('isPremium') isPremium: boolean,
    @Query('category') category: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (!name) {
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
