import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import {postLoginByFacebookAPI, postRegisterByFacebookAPI} from '../apis';
import {postRegisterByFacebook, login} from '../actions';
import {POST_LOGIN_BY_FACEBOOK_API, POST_REGISTER_BY_FACEBOOK_API} from "../actions/action-types";

const NOT_HAVE_ACCOUNT = 499;

/*-----saga effects-----*/
function* postLoginByFacebookEffectSaga(params) {
    try {
        yield put(showLoading());
        const {payload} = params;
        const {id: facebookId, accessToken: token} = payload;
        const response = yield call(postLoginByFacebookAPI, {facebookId, token});
        if (response.error) {
            const {error} = response;
            if (error.errorCode && error.errorCode === NOT_HAVE_ACCOUNT) {
                console.log('postSignUpByFacebook with response: ', response);
                yield put(postRegisterByFacebook(payload));
            } else {
                console.log('postLoginByFacebook failed: ', error);
            }
        } else {
            yield put(login(response.data));
        }
    } catch (error) {
        console.log('postLoginByFacebook failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}


export function* postRegisterFacebookSaga(facebookData) {
    try {
        yield put(showLoading());
        const response = yield call(postRegisterByFacebookAPI, facebookData);
        if (response.error) {
            const error = response.error;
            console.log('postRegisterByFacebook error', error);
        } else
            yield put(login(response.data));
    } catch (error) {
        console.log('postRegisterByFacebook failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}


/*-----saga watchers-----*/
function* postLoginByFacebookWatcherSaga() {
    yield takeLatest(POST_LOGIN_BY_FACEBOOK_API, postLoginByFacebookEffectSaga);
}

function* postRegisterByFacebookWatcherSaga() {
    yield takeLatest(POST_REGISTER_BY_FACEBOOK_API, postRegisterFacebookSaga);
}

export default [
    postLoginByFacebookWatcherSaga(),
    postRegisterByFacebookWatcherSaga(),
];
