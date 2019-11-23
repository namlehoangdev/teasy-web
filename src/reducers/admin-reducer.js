import {
    CANCEL_CREATE_QUESTION_DIALOG,
    OPEN_CREATE_QUESTION_DIALOG,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    UPDATE_EDITING_CONTEST,
    UPDATE_EDITING_QUESTION,
    UPDATE_EDITING_TEST,
    UPDATE_OWNED_CONTESTS,
    LOGOUT,
    UPDATE_ADMIN_QUESTIONS,
    UPDATE_ADMIN_QUESTION_BY_ID,
    UPDATE_ADMIN_TESTS,
    UPDATE_ADMIN_TEST_BY_ID, UPDATE_OWN_TESTS
} from '../actions/action-types';
// import {normalize, schema} from 'normalizr';
// import fakeContests from './fake-contests';
import {QUESTION_DIALOG_MODE} from "../consts";
import {produce} from "immer";
//import fakeQuestions from '../fake-data/fake-questions';
import {DefaultNormalizer, normalizer} from "../utils/byid-utils";
// import {EditorState} from 'draft-js';
// import {fakeTest} from "../fake-data";


//const contestSchema = new schema.Entity('contest');
// const testSchema = new schema.Entity('test');
// const questionSchema = new schema.Entity('question');
// const contestListSchema = new schema.Array(contestSchema);
// const dump = {
//     questions: {
//         byId: [
//             -1
//         ],
//         byHash: {
//             '-1': {
//                 id: -1,
//                 content: EditorState.createEmpty(),
//                 type: 0,
//                 answers: {
//                     byId: [],
//                     byHash: {}
//                 }
//             }
//         },
//         name: 'AASD'
//     }
// }
const initialState = {
    isOpenAdminFullscreenDialog: false,
    contest: new DefaultNormalizer(),
    tests: new DefaultNormalizer(),
    questions: new DefaultNormalizer(),//normalizer(fakeQuestions),
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
            case UPDATE_OWNED_CONTESTS:
                draft.contests = normalizer(payload.contests) || new DefaultNormalizer();
                return;

            case UPDATE_OWN_TESTS:
                console.log('update own test: ', payload);
                draft.tests = normalizer(payload.tests) || new DefaultNormalizer();
                console.log(draft.tests);

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


            case UPDATE_ADMIN_QUESTIONS:
                draft.questions = normalizer(payload.questions) || new DefaultNormalizer();
                return;

            case UPDATE_ADMIN_QUESTION_BY_ID: {
                const {id, question} = payload;
                draft.questions.byHash[id] = question;
                return;
            }

            case UPDATE_ADMIN_TESTS:
                draft.tests = payload.tests;
                return;

            case UPDATE_ADMIN_TEST_BY_ID: {
                const {id, test} = payload;
                draft.tests.byHash[id] = test;
                return;
            }
            case LOGOUT:
                draft = initialState;
                return;
        }
    });
}

// function adminReducer(state = initialState, action) {
//     const {type, payload} = action;
//     switch (type) {
//         case SET_OPEN_ADMIN_FULLSCREEN_DIALOG:
//             return {...state, isOpenAdminFullscreenDialog: payload.value};
//         case UPDATE_OWNED_CONTESTS:
//             return {...state, ownedContestIds: [], contests: payload.contests};
//         case OPEN_CREATE_QUESTION_DIALOG:
//             return {...state, questionDialog: {isOpen: true, mode: QUESTION_DIALOG_MODE.create}, editingQuestion: {}};
//         case UPDATE_EDITING_QUESTION:
//             return {...state, editingQuestion: {...state.editingQuestion, ...payload}};
//         case UPDATE_EDITING_CONTEST:
//             return {...state, editingContest: {...state.editingContest, ...payload}};
//         case UPDATE_EDITING_TEST:
//             return {...state, editingTest: {...state.editingContest, ...payload}};
//         default:
//             return state;
//     }
// }
