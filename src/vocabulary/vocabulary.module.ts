import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './entities/vocabulary.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class VocabularyModule {}
