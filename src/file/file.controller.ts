import { Controller, Get, Param } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Get(':id')
  async getSignedURL(@Param('id') id: string) {
    const { name } = await this.FileService.findDesign(id);
    const preSignedURL = await this.FileService.getPreSignedURL(`${name}.rar`);
    return { preSignedURL };
  }
}
