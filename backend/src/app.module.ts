import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller'; // ✅ Import the controller
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Enables .env support
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'mekke187',
      password: process.env.DB_PASS || 'mekke187',
      database: process.env.DB_NAME || 'socio',
      autoLoadEntities: true,
      synchronize: true,  // 🚨 Do NOT use in production
    }), AuthModule,
  ],
  controllers: [AppController], // ✅ Register the controller
})
export class AppModule { }