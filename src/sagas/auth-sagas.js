import {takeLatest, call, put, takeEvery} from "redux-saga/effects";
//import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from "../apis";
import {history} from "../configurations";
import {
    postRegisterThirdParty,
    login,
    showMiniLoading,
    hideMiniLoading,
    updateUnauthorizedDialog
} from "../actions";
import {
    POST_LOGIN_BY_THIRD_PARTY,
    POST_REGISTER_BY_THIRD_PARTY,
    LOGOUT
} from "../actions/action-types";
import {PAGE_PATHS, THIRD_PARTY, THIRD_PARTY_TOKEN_PREFIX} from "../consts";
import {HTTP_STATUS_CODES} from "../consts/http-status-codes-consts";
import _ from "lodash";

function mapDataFromThirdParty(data) {
    const {accessToken: thirdPartyToken, thirdParty, ...otherData} = data;
    const token = `${THIRD_PARTY_TOKEN_PREFIX[thirdParty]}${thirdPartyToken}`;
    switch (thirdParty) {
        case THIRD_PARTY.facebook: {
            console.log("facebook data: ", data);
            const {id: thirdPartyId, email, picture} = data;
            const avatarUrl = picture.data.url;
            return {
                thirdPartyId,
                thirdPartyToken,
                email,
                token,
                avatarUrl,
                ...otherData
            };
        }
        case THIRD_PARTY.google: {
            const {profileObj} = data;
            const {
                googleId: thirdPartyId,
                googleName: name,
                imageUrl: avatarUrl,
                ...otherGoogleProfileData
            } = profileObj;
            return {
                thirdPartyId,
                avatarUrl,
                name,
                token,
                ...otherGoogleProfileData
            };
        }
    }
}

/*-----saga effects-----*/
function* postLoginByThirdPartyEffectSaga({payload}) {
    const {isTokenOnly} = payload;
    const thirdPartyData = mapDataFromThirdParty(payload);
    const {thirdPartyId, token} = isTokenOnly ? payload : thirdPartyData;
    console.log("third party data: ", thirdPartyData);
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.postLoginByThirdParty, {
            thirdPartyId,
            token
        });
        yield put(login(response.data));
    } catch (error) {
        console.log("Post login by third party failed: ", error);
        const {status} = error;
        if (status === HTTP_STATUS_CODES.unauthorized) {
            console.log("prepare to call register");
            yield put(postRegisterThirdParty(payload));
        }
    } finally {
        yield put(hideMiniLoading());
    }
}

export function* postRegisterThirdPartySaga({payload}) {
    console.log(payload);
    const thirdPartyData = mapDataFromThirdParty(payload);
    console.log("third party data: ", thirdPartyData);
    const {thirdPartyId, token, name, email, avatarUrl} = thirdPartyData;
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.postRegisterByThirdPartyAPI, {
            thirdPartyId,
            token,
            name,
            email,
            avatarUrl
        });
        yield put(login(response.data));
    } catch (error) {
        console.log("Post register by third party failed: ", error);
    } finally {
        yield put(hideMiniLoading());
    }
}

export function* logoutSaga() {
    yield put(updateUnauthorizedDialog(false));
    history.replace(PAGE_PATHS.landing);
}

/*-----saga watchers-----*/
function* postLoginByThirdPartyWatcherSaga() {
    yield takeLatest(POST_LOGIN_BY_THIRD_PARTY, postLoginByThirdPartyEffectSaga);
}

function* postRegisterByThirdPartyWatcherSaga() {
    yield takeLatest(POST_REGISTER_BY_THIRD_PARTY, postRegisterThirdPartySaga);
}

function* postLogoutWatcherSaga() {
    yield takeEvery(LOGOUT, logoutSaga);
}

export default [
    postLoginByThirdPartyWatcherSaga(),
    postRegisterByThirdPartyWatcherSaga(),
    postLogoutWatcherSaga()
];
