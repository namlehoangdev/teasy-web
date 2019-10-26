import {
    OPEN_CREATE_QUESTION_DIALOG,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG, UPDATE_EDITING_CONTEST, UPDATE_EDITING_QUESTION, UPDATE_EDITING_TEST,
    UPDATE_OWNED_CONTESTS
} from '../actions/action-types';
import {normalize, schema} from 'normalizr';
import fakeContests from './fake-contests';
import {QUESTION_DIALOG_MODE, TEXT} from "../consts";


const contestSchema = new schema.Entity('contest');
const testSchema = new schema.Entity('test');
const questionSchema = new schema.Entity('question');


const contestListSchema = new schema.Array(contestSchema);


const initialState = {
    isOpenAdminFullscreenDialog: false,

    contest: {},
    tests: {},
    questions: {},

    questionDialog: {
        mode: QUESTION_DIALOG_MODE.create,
        isOpen: true
    },
    editingContest: {},
    editingTest: {},
    editingQuestion: {},

    error: null,
};


export default function adminReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case SET_OPEN_ADMIN_FULLSCREEN_DIALOG:
            return {...state, isOpenAdminFullscreenDialog: payload.value};
        case UPDATE_OWNED_CONTESTS:
            return {...state, ownedContestIds: [], contests: payload.contests};
        case OPEN_CREATE_QUESTION_DIALOG:
            return {...state, questionDialog: {isOpen: true, mode: QUESTION_DIALOG_MODE.create}, editingQuestion: {}};
        case UPDATE_EDITING_QUESTION:
            return {...state, editingQuestion: {...state.editingQuestion, ...payload}};
        case UPDATE_EDITING_CONTEST:
            return {...state, editingContest: {...state.editingContest, ...payload}};
        case UPDATE_EDITING_TEST:
            return {...state, editingTest: {...state.editingContest, ...payload}};
        default:
            return state;
    }
}
