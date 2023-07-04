import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1.1 Import the mongoose module
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/store'), // 1.2 Setup the database
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.17.0.1',
      port: 5432,
      username: 'pguser',
      password: 'pgpassword',
      database: 'pguser',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
     UserModule, AuthModule, CartModule, // 2.2 Add the product module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }