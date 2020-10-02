import {combineReducers} from "redux";
import auth from "./auth";
import details from './details'

export default combineReducers({auth, details});
