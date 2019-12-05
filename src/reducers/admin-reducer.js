import {
    CANCEL_CREATE_QUESTION_DIALOG,
    OPEN_CREATE_QUESTION_DIALOG,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    UPDATE_EDITING_CONTEST,
    UPDATE_EDITING_QUESTION,
    UPDATE_EDITING_TEST,
    UPDATE_OWN_CONTESTS,
    LOGOUT,
    UPDATE_OWN_QUESTIONS,
    UPDATE_OWN_QUESTION_BY_ID,
    UPDATE_OWN_TEST_BY_ID, UPDATE_OWN_TESTS, UPDATE_OWN_CONTEST_BY_ID
} from '../actions/action-types';
import {QUESTION_DIALOG_MODE} from "../consts";
import {produce} from "immer";

import {DefaultNormalizer, normalizer} from "../utils/byid-utils";
import {fakeQuestions} from "../fake-data";


const initialState = {
    isOpenAdminFullscreenDialog: false,
    contests: new DefaultNormalizer(),
    tests: new DefaultNormalizer(),
    questions:normalizer(fakeQuestions),  //new DefaultNormalizer(),
    questionDialog: {
        mode: QUESTION_DIALOG_MODE.create,
        isOpen: false
    },
    editingContest: {
        isPublic: false, permittedUsers: [], testIds: [], name: '',
        description: '', isSecured: false, password: '',
        startDate: null,
        duration: null
    },
    editingTest: {},
    editingQuestion: {},
    error: null,
};

export default function adminReducer(state = initialState, action) {
    return produce(state, draft => {
        const {type, payload} = action;
        switch (type) {
            case SET_OPEN_ADMIN_FULLSCREEN_DIALOG:
                draft.isOpenAdminFullscreenDialog = payload.value;
                return;
            case UPDATE_OWN_CONTESTS:
                draft.contests = payload.contests || new DefaultNormalizer();
                return;
            case UPDATE_OWN_TESTS:
                draft.tests = payload.tests || new DefaultNormalizer();
                return;
            case UPDATE_OWN_QUESTIONS:
                draft.questions = payload.questions || new DefaultNormalizer();
                return;
            case OPEN_CREATE_QUESTION_DIALOG:
                draft.questionDialog = {isOpen: true, mode: QUESTION_DIALOG_MODE.create};
                draft.editingQuestion = {};
                return;
            case CANCEL_CREATE_QUESTION_DIALOG:
                draft.questionDialog = {isOpen: false, mode: null};
                draft.editingQuestion = {};
                return;
            case UPDATE_EDITING_QUESTION:
                draft.editingQuestion = {...draft.editingQuestion, ...payload};
                return;
            case UPDATE_EDITING_CONTEST:
                draft.editingContest = {...draft.editingContest, ...payload};
                return;
            case UPDATE_EDITING_TEST:
                draft.editingTest = {...draft.editingTest, ...payload};
                return;

            case UPDATE_OWN_QUESTION_BY_ID: {
                const {id, question} = payload;
                draft.questions.byHash[id] = question;
                return;
            }
            case UPDATE_OWN_TEST_BY_ID: {
                const {id, test} = payload;
                draft.tests.byHash[id] = test;
                return;
            }
            case UPDATE_OWN_CONTEST_BY_ID: {
                const {id, contest} = payload;
                draft.contests = payload.contests;
                draft.contests.byHash[id] = contest;
                return;
            }

            case LOGOUT:
                draft = initialState;
                return;
        }
    });
}

