import authSagas from './auth-sagas';
import userSagas from './user-sagas';
import {all} from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([
        ...authSagas,
        ...userSagas
    ])
}

