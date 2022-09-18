import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Get(':id')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    let { name } = await this.FileService.findDesign(id);
    let retrieveFileFromS3 = await this.FileService.downloadFromS3(name);

    const file = createReadStream(join(process.cwd(), `/downloads/${name}`));
    res.set({
      'Content-Type': 'application/rar',
      'Content-Disposition': `attachment; filename="${name}"`,
    });
    return new StreamableFile(file);
  }
}
