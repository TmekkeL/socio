import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'mekke187',
      password: process.env.DB_PASS || 'mekke187',
      database: process.env.DB_NAME || 'socio',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]), // ✅ This solves the injection error
    AuthModule,
  ],
  controllers: [AppController, UserController],
})
export class AppModule { }
