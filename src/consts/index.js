import VIETNAMESE from './text-vietnamese-consts';
import ENGLISH from './text-english-consts';

export * from './text-consts';
export * from './page-paths-conts';

export const LOGIN_MODE = {
  admin: 'admin',
  playground: 'playground'
};

export const THIRD_PARTY = {
  facebook: 'facebook',
  google: 'google'
};

export const THIRD_PARTY_TOKEN_PREFIX = {
  facebook: 'FB',
  google: 'GG'
};

export const QUESTION_TYPE_CODES = {
  quiz: 0,
  fillBlank: 2,
  matching: 3,
  essay: 4,
  quizMulti: 5
};

export const QUESTION_TYPE_TEXT = {
  [QUESTION_TYPE_CODES.quiz]: 'Trắc nghiệm',
  [QUESTION_TYPE_CODES.fillBlank]: 'Điền vào chỗ trống',
  [QUESTION_TYPE_CODES.matching]: 'Ghép nối',
  [QUESTION_TYPE_CODES.essay]: 'Tự luận',
  [QUESTION_TYPE_CODES.quizMulti]: 'Trắc nghiệm nhiều đáp án',
};

export const QUESTION_DIALOG_MODE = {
  create: 'create',
  update: 'update'
};

export const LANGUAGE = {
  'VN': VIETNAMESE,
  'EN': ENGLISH
}
