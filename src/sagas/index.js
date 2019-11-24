import authSagas from './auth-sagas';
import userSagas from './user-sagas';
import adminSagas from './admin-sagas';
import playgroundSagas from './playground-sagas';
import {all} from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([
        ...authSagas,
        ...userSagas,
        ...adminSagas,
        ...playgroundSagas
    ])
}

