import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleWare from 'redux-saga';
import createRootReducer from './reducers';
import rootSaga from './sagas';
import {createBrowserHistory} from "history";
import {routerMiddleware} from 'connected-react-router'

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleWare();
const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware));

const store = createStore(createRootReducer(history), enhancer);
sagaMiddleware.run(rootSaga);
export {history, store};
