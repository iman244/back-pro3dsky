import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { verifyAdminMiddleware } from 'src/middlewares/verifyAdmin.middleware';
import { verifyUserMiddleware } from 'src/middlewares/verifyUser.middleware';
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
// export class DesignModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(verifyUserMiddleware)
//       .forRoutes(
//         { path: 'designs', method: RequestMethod.GET },
//         { path: 'designs/:id', method: RequestMethod.GET },
//       );
//     consumer
//       .apply(verifyAdminMiddleware)
//       .exclude(
//         { path: 'designs', method: RequestMethod.GET },
//         { path: 'designs/:id', method: RequestMethod.GET },
//       )
//       .forRoutes('designs');
//   }
// }
export class DesignModule {}
