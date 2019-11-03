import {
    UPDATE_THEME_MODE, UPDATE_LANGUAGE_MODE, LOGOUT
} from '../actions/action-types';
import {LANGUAGE} from '../consts/index';

const initialState = {
    isDark: false,
    language: LANGUAGE.VN
};

export default function settingReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case UPDATE_THEME_MODE: {
            const {isDark} = payload;
            return {...state, isDark};
        }
        case UPDATE_LANGUAGE_MODE: {
            const {language} = payload;
            return {...state, language};
        }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
