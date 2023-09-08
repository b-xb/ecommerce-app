import { combineReducers } from "redux";
import registrationFormReducer from './registrationForm/registrationFormSlice';
import loginFormReducer from './logInForm/loginFormSlice';
import sessionReducer from './session/sessionSlice';


export default combineReducers({
  registrationForm: registrationFormReducer,
  loginForm: loginFormReducer,
  session: sessionReducer,
});