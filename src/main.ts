import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';
const cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    origin: true,
    // origin: [
    //   'http://pro3dsky.com',
    //   'http://adminpanel.pro3dsky.com',
    //   'http://www.pro3dsky.com',
    //   'https://pro3dsky.com',
    //   'https://adminpanel.pro3dsky.com',
    //   'https://www.pro3dsky.com',
    // ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
  await app.listen(3000);
}
bootstrap();

/*
didan va delete kardan sayer user hay admin
*/
