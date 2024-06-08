import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DailyDataModule } from './daily-data/daily-data.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/omal_web'),
    CatModule,
    AuthModule,
    UsersModule,
    DailyDataModule,
    VocabularyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
