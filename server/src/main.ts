import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const CONST = {
  SERVER_PORT: 3001
}

function setAllowCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT,    PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set headers to allow cors
  app.use(setAllowCorsHeaders);

  await app.listen(CONST.SERVER_PORT);
}
bootstrap();
