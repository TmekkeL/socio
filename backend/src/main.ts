import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow frontend (localhost:3000) to access backend (cookies included)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ✅ Middleware to parse HTTP-only cookies
  app.use(cookieParser());

  // ✅ Apply global validation (e.g. for DTOs)
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Optional health check to verify backend is live
  app.getHttpAdapter().get('/', (req, res) => {
    res.send('✅ API is running. No forced redirects.');
  });

  // ✅ Log if DB connection is active
  try {
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      console.log('✅ Successfully connected to the database!');
    } else {
      console.error('❌ Database connection is not initialized.');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }

  // ✅ Listen on backend port
  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}

bootstrap();
