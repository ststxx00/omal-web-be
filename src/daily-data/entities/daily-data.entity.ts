import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DailyDataStatus, Reading, Ymd } from 'src/types';

export type DailyDataDocument = HydratedDocument<DailyData>;

@Schema()
export class DailyData {
  @Prop(
    raw({
      year: { type: Number },
      month: { type: Number },
      day: { type: Number },
    }),
  )
  date: Ymd; // 묵상 날짜

  @Prop()
  status: DailyDataStatus; // 게시 여부

  @Prop()
  scripture: Reading[]; // 독서

  @Prop()
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
