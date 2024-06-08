import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DailyData } from './entities/daily-data.entity';
import { Model } from 'mongoose';

@Injectable()
export class DailyDataService {
  constructor(
    @InjectModel(DailyData.name) private dailyDataModel: Model<DailyData>,
  ) {}

  async fetchReadings(): Promise<boolean> {
    return true;
  }
}
