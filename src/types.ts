export type Ymd = {
  year: number;
  month: number;
  day: number;
};

export type DailyDataStatus = 'DRAFT' | 'PUBLISHED';

export type Reading = {
  type: ReadingType; // Scripture(독서) | Gospel(복음)
  index: number; // 제 1독서, 제 2독서 의 숫자
  book: string; // 요나 예언서의 말씀에서의 요나서와 같은 책 이름
  chapter: number; // 장
  startVerse: number; // 시작 절
  endVerse: number; // 끝 절
  verses: string[]; // 절 마다 끊어서 배열로 저장
};

export type ReadingType = 'SCRIPTURE' | 'GOSPEL'; // 독서 | 말씀
