import {UPDATE_SHOW_LOADING_BAR, UPDATE_SHOW_MINI_LOADING, LOGOUT} from '../actions/action-types';

const initialState = {
    isShowMiniLoading: false,
    isShowLoadingBar: false,
    error: null,
};

export default function playgroundReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case UPDATE_SHOW_LOADING_BAR:
            return {...state, isShowLoadingBar: payload};
        case UPDATE_SHOW_MINI_LOADING:
            return {...state, isShowMiniLoading: payload};
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
