import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DailyDataStatus, Reading, Ymd, ReadingType } from 'src/types';

export type DailyDataDocument = HydratedDocument<DailyData>;

const ReadingSchema = raw({
  type: { type: String, enum: ['SCRIPTURE', 'GOSPEL'], required: true },
  index: { type: Number, required: true },
  title: { type: String, required: true },
  contents: { type: String, required: true },
});

const YmdSchema = raw({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
});

@Schema()
export class DailyData {
  @Prop(YmdSchema)
  date: Ymd; // 묵상 날짜

  @Prop()
  status: DailyDataStatus; // 게시 여부

  @Prop([ReadingSchema])
  scripture: Reading[]; // 독서

  @Prop([ReadingSchema])
  gospel: Reading[]; // 말씀

  @Prop()
  reflection: string; // 묵상글

  @Prop()
  videoUrl: string; // youtube url
}

export const DailyDataSchema = SchemaFactory.createForClass(DailyData).set(
  'timestamps',
  true,
);
