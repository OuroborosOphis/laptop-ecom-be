import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Add your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  app.use(cookieParser())
  console.log('Template dir:', path.join(process.cwd(), 'src', 'mailtemplate'));
}
bootstrap();
