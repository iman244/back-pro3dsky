import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from './user/user.model';
import { DesignModule } from './design/design.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://pro3dsky:0afIIpgKy7YM25Jp@cluster0.xgb4ow9.mongodb.net/pro3dsky',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserModule,
    AuthModule,
    DesignModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
