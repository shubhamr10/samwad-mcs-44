import { combineReducers } from 'redux';
import alert from './alert';
import authReducer from './auth.reducer';
import profileReducer from './profile.reducer';

export default combineReducers({
    alert,
    auth:authReducer,
    profile:profileReducer
});