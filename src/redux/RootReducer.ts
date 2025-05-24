import { combineReducers } from '@reduxjs/toolkit';
import conversationsReducer from './Reducer';

const rootReducer = combineReducers({
  conversations: conversationsReducer,
});

export default rootReducer;