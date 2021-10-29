import axios from 'axios';
import { setAlert } from './alert.action';
import { GET_PROFILE, PROFILE_ERROR } from './types';


/**
 * @description : GET CURRENT USER PROFILE
 */
export const getCurrentProfile = () => async dispatch => {

    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{ msg:error.response.statusText, status: error.response.status }
        })
    }
}