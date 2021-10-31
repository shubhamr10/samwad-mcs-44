import { ADD_COMMENT, ADD_POST, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, REMOVE_COMMENT, UPDATE_LIKES } from "../actions/types";

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
};

export default function postReducer(state = initialState, action) {
    const { type, payload } = action;
    var newPosts;
    switch (type) {
        case GET_POSTS:
            return { ...state, loading: false, posts: payload };
        case ADD_POST:
            return { ...state, loading:false, posts:[payload,...state.posts] };
        case GET_POST:
            return { ...state, loading:false, post:payload }
        case POST_ERROR:
            return { ...state, loading: false, error: payload };
        case UPDATE_LIKES:
            newPosts = [];
            newPosts = state.posts.map(post => post._id === payload.postId ? { ...post, likes: payload.likes } : post);
            return { ...state, posts: newPosts, loading: false };
        case DELETE_POST:
            newPosts = [];
            newPosts = state.posts.filter(post => post._id !== payload.postId);
            return { ...state, posts: newPosts, loading: false };
        case ADD_COMMENT:
            return {
                ...state,
                loading:false,
                post:{
                    ...state.post,
                    comments:payload
                }
            }
        case REMOVE_COMMENT:
            return {
                ...state,
                loading:false,
                post:{
                    ...state.post,
                    comments:state.post.comments.filter(comm => comm._id !== payload)
                }
            }
        default:
            return state;
    }
}