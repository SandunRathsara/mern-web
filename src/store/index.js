import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import auth_reducer from './auth_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
  auth: auth_reducer,
  user: userReducer,
});

// noinspection JSUnresolvedVariable
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
