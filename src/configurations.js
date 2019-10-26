import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import createSagaMiddleWare from 'redux-saga';
import createRootReducer from './reducers';
import rootSaga from './sagas';
import {createBrowserHistory} from "history";
import {routerMiddleware} from 'connected-react-router';


const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleWare();
const rootReducer = createRootReducer(history);

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['authReducer']
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware));

const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export {history, store, persistor};
