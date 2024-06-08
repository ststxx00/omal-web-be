import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop()
  dailyData_ids: ObjectId[]; // 하나의 단어가 여러 묵상글에 등록될 수 있기 때문에 배열

  @Prop()
  index: number; // 단어 번호

  @Prop()
  voca: string; // 단어

  @Prop()
  description: string; // 설명
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary).set(
  'timestamps',
  true,
);
