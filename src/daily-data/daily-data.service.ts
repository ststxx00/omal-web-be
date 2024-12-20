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
    const title = titleIndex !== -1 ? $('.bd_tit').eq(titleIndex).text().trim() : '-';
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
    const title = titleIndex !== -1 ? $('.bd_tit').eq(titleIndex).text().trim() : '-';
    let reading = $('.board_layout').eq(titleIndex).text().trim();
    reading = this.removeAngleBracketContent(reading);
    const unwantedString = '주님의 말씀입니다.◎ 그리스도님, 찬미합니다.';
    if (reading.includes(unwantedString)) {
      reading = reading.replace(unwantedString, '').trim();
    }
    const readingRes: Reading = {
      type: 'GOSPEL',
      index: titleIndex,
      title,
      contents: reading
    }
    return readingRes;
  }

  async scrapByDay(year: number, month: number, day: number): Promise<Types.ObjectId> {
    const url = `https://maria.catholic.or.kr/mi_pr/missa/missa.asp?menu=missa&gomonth=${year}-${month}-${day}`;
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
        year,
        month,
        day,
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

  async scrapByMonth(year: number, month: number): Promise<number> {
    const dailyDataIds: Types.ObjectId[] = [];
    for (let i = 1; i <= 31; i++) {
      const date = `${year}-${month}-${i}`;
      const url = `https://maria.catholic.or.kr/mi_pr/missa/missa.asp?menu=missa&gomonth=${date}`;
      try {
        const { data } = await axios.get(url);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          break; // Exit the loop if a 500 response is received
        } else {
          throw error; // Rethrow other errors
        }
      }
      const dailyDataId = await this.scrapByDay(year, month, i);
      dailyDataIds.push(dailyDataId);
    }
    return dailyDataIds.length;
  }
}
