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
};

export default function auth(state = initialAuthState, action) {
    switch (action.type) {
        case CLEAR_AUTH_STATE:
            return {
                ...state,
                error: null,
            };
        case FORGOT_START:
        case LOGIN_START:
        case SIGNUP_START:
            return {
                ...state,
                inProgress: true,
            };
        case LOGIN_SUCCESS:
        case SIGNUP_SUCCESS:
            return {
                ...state,
                user: action.user,
                inProgress: false,
                error: null,
                isLoggedIn: true,
            };
        case FORGOT_FAILURE:
        case FORGOT_SUCCESS:
        case LOGIN_FAILURE:
        case SIGNUP_FAILURE:
            return {
                ...state,
                error: action.error,
                inProgress: false,
            };
        case AUTHENTICATE_USER:
            return {
                ...state,
                user: action.user,
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
