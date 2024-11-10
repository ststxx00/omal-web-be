import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestDataDocument = HydratedDocument<TestData>;

@Schema()
export class TestData {
  @Prop()
  testName: string;

  @Prop()
  testAge: number;
}

export const TestDataSchema = SchemaFactory.createForClass(TestData);