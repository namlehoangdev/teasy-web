import {
  UPDATE_THEME_MODE
} from '../actions/action-types';

const initialState = {
  isDark: false,
};

export default function settingReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_THEME_MODE: {
      const { isDark } = payload;
      return { ...state, isLogin: true, profile: payload, isDark };
    }
    default:
      return state;
  }
}
