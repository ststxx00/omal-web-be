export type Ymd = {
  year: number;
  month: number;
  day: number;
};

// - : 미작성
// DRAFT : 임시 저장
// PUBLISHED : 게시됨
export type DailyDataStatus = '-' | 'DRAFT' | 'PUBLISHED';

export type Reading = {
  type: ReadingType; // Scripture(독서) | Gospel(복음)
  index: number; // 제 1독서, 제 2독서 의 숫자
  title: string; // 제목 (제 1독서, 제 2독서)
  contents: string; // 내용
};

export type ReadingType = 'SCRIPTURE' | 'GOSPEL'; // 독서 | 말씀
