import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { bcryptSaltRounds } from 'src/auth/constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      bcryptSaltRounds,
    );
    const createUserDtoWithHashedPassword: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUser = new this.userModel(createUserDtoWithHashedPassword);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findOneByUserId(userId: string): Promise<User> {
    return this.userModel
      .findOne({
        userId: userId,
      })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      id,
      {
        $set: updateUserDto,
      },
      { returnDocument: 'after' },
    );
  }

  async remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
