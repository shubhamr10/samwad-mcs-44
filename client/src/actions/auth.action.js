import axios from 'axios';
import { REGISTER_FAILED, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_FAILED, LOGIN_SUCCESS, LOGOUT } from './types';
import { setAlert } from './alert.action';
import setAuthToken from '../utils/setAuthToken';

/**
 * 
 * @DESC LOAD USER 
 * @returns - user data
 */
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

/**
 * Register User
 */
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ name, email, password });
    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.map(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAILED
        })
    }
};


/**
 * @description : Login user
 */
export const login = (email, password) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    }
    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.map(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAILED
        })
    }
}

/**
 * @description : LOGOUT
 */
export const logout = () => dispatch => {
    dispatch({type:LOGOUT});
}