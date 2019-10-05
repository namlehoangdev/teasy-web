import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleWare from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';
import {createBrowserHistory} from "history";

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleWare();
const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
);

const store = createStore(rootReducer, enhancer);
sagaMiddleware.run(rootSaga);
export {history, store};
