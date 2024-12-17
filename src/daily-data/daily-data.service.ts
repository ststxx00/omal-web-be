import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DailyData } from './entities/daily-data.entity';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Reading } from 'src/types';

@Injectable()
export class DailyDataService {
  constructor(
    @InjectModel(DailyData.name) private dailyDataModel: Model<DailyData>,
  ) {}

  async scrapScriptures($: cheerio.CheerioAPI, index: number): Promise<Reading> {
    let titleIndex = -1;
    $('.bd_tit').each((i, el) => {
      if ($(el).text().includes(`제${index}독서`)) {
        titleIndex = i;
        return false; // Break the loop
      }
    });
    const title = titleIndex !== -1 ? $('.bd_tit').eq(titleIndex).text().trim() : '';
    let reading = $('.board_layout').eq(titleIndex).text().trim();
    reading = this.removeAngleBracketContent(reading);
    const unwantedString = '주님의 말씀입니다.◎ 하느님, 감사합니다.';
    if (reading.includes(unwantedString)) {
      reading = reading.replace(unwantedString, '').trim();
    }

    const readingRes: Reading = {
      type: 'SCRIPTURE',
      index: titleIndex,
      title,
      contents: reading
    }
    return readingRes;
  }

  async scrapGosphel($: cheerio.CheerioAPI): Promise<Reading> {
    let titleIndex = -1;
    $('.bd_tit').each((i, el) => {
      if ($(el).text().trim() === '복음') {
        titleIndex = i;
        return false; // Break the loop
      }
    });
    const title = titleIndex !== -1 ? $('.bd_tit').eq(titleIndex).text().trim() : '';
    let reading = $('.board_layout').eq(titleIndex).text().trim();
    reading = this.removeAngleBracketContent(reading);
    const unwantedString = '주님의 말씀입니다.◎ 그리스도님, 찬미합니다.';
    if (reading.includes(unwantedString)) {
      reading = reading.replace(unwantedString, '').trim();
    }
    const readingRes: Reading = {
      type: 'GOSPEL',
      index: -1,
      title,
      contents: reading
    }
    return readingRes;
  }

  // date ex : '2024-12-25'
  async scrapDay(date: string): Promise<Types.ObjectId> {
    const url = `https://maria.catholic.or.kr/mi_pr/missa/missa.asp?menu=missa&gomonth=${date}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const readingList: Reading[] = [];
    for (let i = 1; i <= 10; i++) {
      const readingRes = await this.scrapScriptures($, i);
      if (readingRes.index === -1) {
        break;
      }
      readingList.push(readingRes);
    }
    const scrapGosphelRes = await this.scrapGosphel($);
    readingList.push(scrapGosphelRes)

    const dailyData = new this.dailyDataModel({
      date: {
        year: Number(date.split('-')[0]),
        month: Number(date.split('-')[1]),
        day: Number(date.split('-')[2]),
      },
      status: 'DRAFT',
      scripture: readingList.filter((reading) => reading.type === 'SCRIPTURE'),
      gospel: readingList.filter((reading) => reading.type === 'GOSPEL'),
      reflection: '',
      videoUrl: '',
    });
    const savedDailyData = await dailyData.save();
    const dailyDataId = savedDailyData._id;

    return dailyDataId;
  }

  removeAngleBracketContent(text: string): string {
    return text.replace(/<[^>]*>/g, '').trim();
  }
}
