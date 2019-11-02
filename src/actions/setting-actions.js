import {
  action,
  UPDATE_THEME_MODE,
  UPDATE_LANGUAGE_MODE,
} from './action-types';


export const updateThemeMode = (payload) => action(UPDATE_THEME_MODE, payload);
export const updateLanguageMode = (payload) => action(UPDATE_LANGUAGE_MODE, payload);