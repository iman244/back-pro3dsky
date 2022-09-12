import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignController } from './design.controller';
import { DesignSchema } from './design.model';
import { DesignService } from './design.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Design', schema: DesignSchema }]),
  ],
  controllers: [DesignController],
  providers: [DesignService],
})
export class DesignModule {}
