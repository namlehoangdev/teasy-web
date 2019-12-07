import { action, UPDATE_SHOW_LOADING_BAR, UPDATE_SHOW_MINI_LOADING, UPDATE_SHOW_CIRCLE_LOADING } from './action-types';

export const showMiniLoading = () => (action(UPDATE_SHOW_MINI_LOADING, true));
export const hideMiniLoading = () => (action(UPDATE_SHOW_MINI_LOADING, false));

export const showLoadingBar = () => (action(UPDATE_SHOW_LOADING_BAR, true));
export const hideLoadingBar = () => (action(UPDATE_SHOW_LOADING_BAR, false));

export const showCircleLoading = () => (action(UPDATE_SHOW_CIRCLE_LOADING, true));
export const hideCircleLoading = () => (action(UPDATE_SHOW_CIRCLE_LOADING, false));