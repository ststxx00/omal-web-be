import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userId: string;

  @Prop()
  password: string;

  @Prop()
  username: string;

  @Prop()
  roles: Role;
}

export const UserSchema = SchemaFactory.createForClass(User).set(
  'timestamps',
  true,
);
