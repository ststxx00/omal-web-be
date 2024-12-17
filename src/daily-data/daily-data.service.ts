import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DailyData } from './entities/daily-data.entity';
import { Model } from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class DailyDataService {
  constructor(
    @InjectModel(DailyData.name) private dailyDataModel: Model<DailyData>,
  ) {}

  async scrapMissa(targetTitle: string): Promise<any> {
    const url = 'https://maria.catholic.or.kr/mi_pr/missa/missa.asp?menu=missa&gomonth=2024-12-25';
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      let titleIndex = -1;
      $('.bd_tit').each((i, el) => {
        if ($(el).text().includes(targetTitle)) {
          titleIndex = i;
          return false; // Break the loop
        }
      });
      const title = titleIndex !== -1 ? $('.bd_tit').eq(titleIndex).text().trim() : '';
      const reading = $('.board_layout').eq(titleIndex).text().trim();
      return {
        titleIndex,
        title,
        reading
      };
    } catch (error) {
      console.error('Error scraping readings:', error);
      return 'error...';
    }
  }

  async scrapScriptures($: cheerio.CheerioAPI, index: number): Promise<ScrapRes> {
    let titleIndex = -1;
    $('.bd_tit').each((i, el) => {
      if ($(el).text().includes(`제${index}독서`)) {
        titleIndex = i;
        return false; // Break the loop
      }
    });
    const title = titleIndex !== -1 ? $('.bd_tit').eq(titleIndex).text().trim() : '';
    const reading = $('.board_layout').eq(titleIndex).text().trim();
    const scrapRes = {
      titleIndex,
      title,
      reading
    }
    return scrapRes;
  }

  // date ex : '2024-12-25'
  async scrapDay(date: string): Promise<ScrapRes[]> {
    const url = `https://maria.catholic.or.kr/mi_pr/missa/missa.asp?menu=missa&gomonth=${date}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const scrapResList: ScrapRes[] = [];
    for (let i = 1; i <= 10; i++) {
      const scrapRes = await this.scrapScriptures($, i);
      if (scrapRes.titleIndex === -1) {
        break;
      }
      scrapResList.push(scrapRes);
    }
    return scrapResList;
  }
}

type ScrapRes = {
  titleIndex: number,
  title: string,
  reading: string,
}
