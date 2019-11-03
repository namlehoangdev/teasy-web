import {takeLatest, call, put} from 'redux-saga/effects';
//import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {postRegisterThirdParty, login, showMiniLoading, hideMiniLoading} from '../actions';
import {POST_LOGIN_BY_THIRD_PARTY, POST_REGISTER_BY_THIRD_PARTY} from "../actions/action-types";
import {THIRD_PARTY, THIRD_PARTY_TOKEN_PREFIX} from "../consts";
import {HTTP_STATUS_CODES} from "../consts/http-status-codes-consts";

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
        console.log('Post login by third party failed: ', error);
        const {status} = error;
        if (status === HTTP_STATUS_CODES.unauthorized) {
            console.log('prepare to call register');
            yield put(postRegisterThirdParty(payload));
        }
    } finally {
        yield put(hideMiniLoading());
    }
}


export function* postRegisterThirdPartySaga({payload}) {
    console.log(payload);
    const thirdPartyData = mapDataFromThirdParty(payload);
    const {thirdPartyId, token, name} = thirdPartyData;
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.postRegisterByThirdPartyAPI, {thirdPartyId, token, name});
        yield put(login(response.data));
    } catch (error) {
        console.log('Post register by third party failed: ', error);
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
