import { combineReducers } from "@reduxjs/toolkit";
import conversationsReducer from "./Reducer";

const rootReducer: any = combineReducers({
  conversations: conversationsReducer,
});

export default rootReducer;