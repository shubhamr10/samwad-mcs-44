import { combineReducers } from 'redux';
import alert from './alert';
import authReducer from './auth.reducer';

export default combineReducers({
    alert,
    auth:authReducer
});