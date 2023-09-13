import { combineReducers } from "redux";
import productsReducer from './products/productsSlice';


export default combineReducers({
  products: productsReducer,
});