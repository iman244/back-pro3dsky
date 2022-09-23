import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    methods: ['POST', 'PUT', 'GET'],
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
