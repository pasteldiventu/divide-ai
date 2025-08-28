// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configura o TypeORM de forma assíncrona para usar as variáveis
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // Lê o host do docker-compose
        port: parseInt(configService.get<string>('DB_PORT','5432')), // Lê a porta
        username: configService.get<string>('DB_USER'), 
        password: configService.get<string>('DB_PASSWORD'), 
        database: configService.get<string>('DB_DATABASE'), 
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Mantenha true para desenvolvimento
      }),
    }),

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}