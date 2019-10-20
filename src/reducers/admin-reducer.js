import {
    OPEN_CREATE_QUESTION_DIALOG,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    UPDATE_OWNED_CONTESTS
} from '../actions/action-types';
import {normalize, schema} from 'normalizr';
import fakeContests from './fake-contests';


const contestSchema = new schema.Entity('contest');
const testSchema = new schema.Entity('test');
const questionSchema = new schema.Entity('question');


const contestListSchema = new schema.Array(contestSchema);


const initialState = {
    isOpenAdminFullscreenDialog: false,

    contest: {},
    tests: {},
    questions: {},

    isOpenQuestionDialog: false,
    editingContest: null,
    editingTest: null,
    editingQuestion: null,

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
            return {...state, editingQuestion: null};
        default:
            return state;
    }
}
