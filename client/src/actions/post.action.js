import axios from 'axios';
import { setAlert } from './alert.action';
import { ADD_COMMENT, ADD_POST, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, REMOVE_COMMENT, UPDATE_LIKES } from './types';


/**
 * @description: GET ALL POSTS
 */
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({ type: GET_POSTS, payload: res.data })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}


/**
 * @description: Add like
 */
export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type: UPDATE_LIKES, payload: {
                postId, likes: res.data
            }
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

/**
 * @description: Remove like
 */
export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKES, payload: {
                postId, likes: res.data
            }
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

/**
 * @description: Delete posts
 */
export const deletePost = (postId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`);
        dispatch({
            type: DELETE_POST, payload: {
                postId
            }
        });
        dispatch(setAlert('Post removed', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}


/**
 * @description: Add post
 */
export const addPost = (formData) => async dispatch => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } }
        const res = await axios.post(`/api/posts`, formData, config);
        dispatch({
            type: ADD_POST,
            payload:res.data
        });
        dispatch(setAlert('Post Created', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}


/**
 * @description: GET SINGLE BY ID POSTS
 */
 export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({ type: GET_POST, payload: res.data })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

/**
 * @description: Add Comments
 */
 export const addComments = (postId,formData) => async dispatch => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } }
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
        dispatch({
            type: ADD_COMMENT,
            payload:res.data
        });
        dispatch(setAlert('Comment added', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

/**
 * @description: Delete Comment
 */
 export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type: REMOVE_COMMENT, payload: commentId
        });
        dispatch(setAlert('Comment removed', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}