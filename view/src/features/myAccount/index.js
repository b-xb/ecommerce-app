import { combineReducers } from "redux";
import userProfileReducer from './userProfile/userProfileSlice';

export default combineReducers({
  userProfile: userProfileReducer,
});