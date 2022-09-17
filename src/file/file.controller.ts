import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  @Get(':id')
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    console.log(join(process.cwd()));
    const fileName = 'file.rar';
    const file = createReadStream(join(process.cwd(), '/uploads/iman1.rar'));
    res.set({
      'Content-Type': 'application/rar',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return new StreamableFile(file);
  }
}
