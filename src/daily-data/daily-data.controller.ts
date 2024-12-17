import { Controller, Get, Query } from '@nestjs/common';
import { DailyDataService } from './daily-data.service';

@Controller('daily-data')
export class DailyDataController {
  constructor(private readonly dailyDataService: DailyDataService) {}

  // date ex : '2024-12-25'
  @Get('reading')
  fetchReadings(@Query('date') date: string) {
    return this.dailyDataService.scrapDay(date);
  }
}
