import {API_STATUS, SET_OPEN_ADMIN_FULLSCREEN_DIALOG} from '../actions/action-types';

const initialState = {
    isLoading: false,
    isOpenAdminFullscreenDialog: false,
    error: null,
};

export default function adminReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case SET_OPEN_ADMIN_FULLSCREEN_DIALOG:
            return {...state, isOpenAdminFullscreenDialog: payload.value};
        case 1:
            return state;
        default:
            return state;
    }
}
