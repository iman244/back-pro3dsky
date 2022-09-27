import { Controller, Get, Param } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Get('uploadLink/:id')
  async getUploadSignedURL(@Param('id') id: string) {
    const { name } = await this.FileService.findDesign(id);

    // const a = this.FileService.getUploadSignedURL(`${name}_0.rar`);

    return 'we are in test';
    // return { UploadpreSignedURL };
  }

  @Get(':id')
  async getSignedURL(@Param('id') id: string) {
    const { name } = await this.FileService.findDesign(id);
    const preSignedURL = await this.FileService.getPreSignedURL(
      `${name}_0.rar`,
    );
    return { preSignedURL };
  }
}
