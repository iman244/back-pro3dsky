import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
const cookieParser = require("cookie-parser");

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use(cookieParser());
    await app.listen(3000);
}
bootstrap();
