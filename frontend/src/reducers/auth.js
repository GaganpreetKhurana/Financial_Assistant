const {
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    SIGNUP_START,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    AUTHENTICATE_USER,
    LOG_OUT,
    CLEAR_AUTH_STATE,
    FORGOT_START,
    FORGOT_SUCCESS,
    FORGOT_FAILURE,
} = require("../actions/actionTypes");

const initialAuthState = {
    user: {},
    details: false,
    error: null,
    isLoggedIn: false,
    inProgress: false,
    success:null,
};

export default function auth(state = initialAuthState, action) {
    switch (action.type) {
        case CLEAR_AUTH_STATE:
            return {
                ...state,
                error: null,
                success: null,
            };
        case FORGOT_START:
        case LOGIN_START:
        case SIGNUP_START:
            return {
                ...state,
                inProgress: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                success: action.success,
                isLoggedIn: true,
                inProgress: false,
                error: null,
                user:action.user,
            };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                success: action.success,
                inProgress: false,
                error: null,
            };
        case FORGOT_FAILURE:
        case LOGIN_FAILURE:
        case SIGNUP_FAILURE:
            return {
                ...state,
                success:null,
                error: action.error,
                inProgress: false,
            };
        case FORGOT_SUCCESS:
            return {
                ...state,
                success:action.success,
                error: null,
                inProgress: false,
            };
        case AUTHENTICATE_USER:
            return {
                ...state,
                user:action.user,
                isLoggedIn: true,
            };
        case LOG_OUT:
            return {
                ...state,
                user: {},
                isLoggedIn: false,
            };
        default:
            return state;
    }
}
