import { Controller, Get, Query } from '@nestjs/common';
import { DailyDataService } from './daily-data.service';

@Controller('daily-data')
export class DailyDataController {
  constructor(private readonly dailyDataService: DailyDataService) {}

  // scrap Gosphel and Scriptures by month from missa website.
  @Get('scrap-by-month')
  async scrapByMonth(@Query('year') year: string, @Query('month') month: string) {
    return this.dailyDataService.scrapByMonth(+year, +month);
  }

  @Get('is-next-month-scraped')
  async isNextMonthScraped() {
    return this.dailyDataService.isNextMonthScraped();
  }
}
