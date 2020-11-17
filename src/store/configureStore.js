import { createStore, combineReducers, applyMiddleware} from 'redux';
import {
  articlesReducer,
  paginationReducer,
  currentUserReducer,
  registrationReducer,
  articleStateReducer
} from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const reducer = combineReducers(
  {
    articlesReducer,
    paginationReducer,
    currentUserReducer,
    registrationReducer,
    articleStateReducer
  }
);

export default function configureStore(initialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunk))
    );
}