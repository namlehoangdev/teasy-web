import {takeLatest, call, put} from 'redux-saga/effects';
//import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {postRegisterThirdParty, login, showMiniLoading, hideMiniLoading} from '../actions';
import {POST_LOGIN_BY_THIRD_PARTY, POST_REGISTER_BY_THIRD_PARTY} from "../actions/action-types";
import {THIRD_PARTY, THIRD_PARTY_TOKEN_PREFIX} from "../consts";

const STATUS_NOT_HAVE_ACCOUNT = 499;

function mapDataFromThirdParty(data) {
    const {accessToken: thirdPartyToken, thirdParty, ...otherData} = data;
    const token = `${THIRD_PARTY_TOKEN_PREFIX[thirdParty]}${thirdPartyToken}`;
    switch (thirdParty) {
        case THIRD_PARTY.facebook: {
            const {id: thirdPartyId} = data;
            return {thirdPartyId, thirdPartyToken, token, ...otherData};
        }
        case THIRD_PARTY.google: {
            const {profileObj} = data;
            const {googleId: thirdPartyId, googleName: name, ...otherGoogleProfileData} = profileObj;
            return {thirdPartyId, name, token, ...otherGoogleProfileData};
        }
    }
}

/*-----saga effects-----*/
function* postLoginByThirdPartyEffectSaga({payload}) {
    const thirdPartyData = mapDataFromThirdParty(payload);
    const {thirdPartyId, token} = thirdPartyData;
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.postLoginByThirdParty, {thirdPartyId, token});
        yield put(login(response.data));
    } catch (error) {
        console.log('postLoginByFacebook failed: ', error);
        const {status, data} = error;
        if (status === 404) {
            const {errorCode} = data;
            if (errorCode && errorCode === STATUS_NOT_HAVE_ACCOUNT) {
                yield put(postRegisterThirdParty(payload));
            }
        }
    } finally {
        yield put(hideMiniLoading());
    }
}


export function* postRegisterThirdPartySaga({payload}) {
    const thirdPartyData = mapDataFromThirdParty(payload);
    const {thirdPartyId, token, name} = thirdPartyData;
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.postRegisterByThirdPartyAPI, {thirdPartyId, token, name});
        yield put(login(response.data));
    } catch (error) {
        console.log('postRegisterByFacebook failed: ', error);
    } finally {
        yield put(hideMiniLoading());
    }
}


/*-----saga watchers-----*/
function* postLoginByThirdPartyWatcherSaga() {
    yield takeLatest(POST_LOGIN_BY_THIRD_PARTY, postLoginByThirdPartyEffectSaga);
}

function* postRegisterByThirdPartyWatcherSaga() {
    yield takeLatest(POST_REGISTER_BY_THIRD_PARTY, postRegisterThirdPartySaga);
}

export default [
    postLoginByThirdPartyWatcherSaga(),
    postRegisterByThirdPartyWatcherSaga(),
];
