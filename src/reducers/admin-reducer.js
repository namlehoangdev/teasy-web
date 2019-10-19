import {SET_OPEN_ADMIN_FULLSCREEN_DIALOG, UPDATE_OWNED_CONTESTS} from '../actions/action-types';
import {normalize, schema} from 'normalizr';
import fakeContests from './fake-contests';


const contestSchema = new schema.Entity('contest');
const questionSchema = new schema.Entity('question');
const testSchema = new schema.Entity('test');


const contestListSchema = new schema.Array(contestSchema);


const initialState = {
    isLoading: false,
    isOpenAdminFullscreenDialog: false,
    error: null,
    contests: normalize(fakeContests, contestListSchema),
    ownedContestIds: [],
};


export default function adminReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case SET_OPEN_ADMIN_FULLSCREEN_DIALOG:
            return {...state, isOpenAdminFullscreenDialog: payload.value};
        case UPDATE_OWNED_CONTESTS:
            return {...state, ownedContestIds: [], contests: payload.contests};
        default:
            return state;
    }
}
