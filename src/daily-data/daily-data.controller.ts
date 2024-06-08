import { Controller, Get } from '@nestjs/common';
import { DailyDataService } from './daily-data.service';

@Controller('daily-data')
export class DailyDataController {
  constructor(private readonly dailyDataService: DailyDataService) {}

  @Get('reading')
  fetchReadings() {
    return this.dailyDataService.fetchReadings();
  }
}
