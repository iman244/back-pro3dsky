import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    // origin: true,
    origin: [
      'http://pro3dsky.com',
      'http://adminpanel.pro3dsky.com',
      'http://www.pro3dsky.com',
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
