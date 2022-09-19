import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from 'src/app.service';
import { DesignSchema } from 'src/design/design.model';
import { verifyUserMiddleware } from 'src/middlewares/verifyUser.middleware';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Design', schema: DesignSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyUserMiddleware).forRoutes('file');
  }
}
