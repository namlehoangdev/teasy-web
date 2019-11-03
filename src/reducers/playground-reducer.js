import {API_STATUS, LOGOUT} from '../actions/action-types';

const initialState = {
    isLoading: false,
    error: null,
};

export default function playgroundReducer(state = initialState, action) {
    switch (action.type) {
        case 0:
            return state;
        case 1:
            return state;
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
