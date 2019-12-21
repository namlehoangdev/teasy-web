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

export const TEST_TYPE_CODES = {
    create: 0,
    import: 1
};

export const TEST_TYPE_TEXT = {
    [TEST_TYPE_CODES.create]: 'mặc định',
    [TEST_TYPE_CODES.import]: 'hình ảnh'
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
};

export const COMPETING_CONTEST_STATE = {
    GET_TEST: 'GET_CONTEST',
    DOING: 'DOING',
    SUBMIT: 'SUBMIT',
    RESPONSE_OF_HAS_FULL_ANSWER: '',
    RESPONSE_OF_NOT_FULL_ANSWER: '',
};

export const QUESTION_STATE = {
    NOT_SCORED: 'NOT_SCORED',
    RIGHT: 'RIGHT',
    WRONG: 'WRONG'
};

export const CONTEST_TYPE_CODE = {
    MATH: 0, PHYSICS: 1, CHEMISTRY: 2, ENGLISH: 3, IT: 4, ELSE: -1
};

export const CONTEST_TYPE_TEXT = {
    [CONTEST_TYPE_CODE.MATH]: 'Toán',
    [CONTEST_TYPE_CODE.PHYSICS]: 'Lý',
    [CONTEST_TYPE_CODE.MATH]: 'Hóa',
    [CONTEST_TYPE_CODE.ENGLISH]: 'Anh',
    [CONTEST_TYPE_CODE.IT]: 'IT',
    [CONTEST_TYPE_CODE.ELSE]: 'Khác'
};
