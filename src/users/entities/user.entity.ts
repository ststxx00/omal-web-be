import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  user_id: string;

  @Prop()
  user_password: string;

  @Prop()
  name: string;

  @Prop()
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
