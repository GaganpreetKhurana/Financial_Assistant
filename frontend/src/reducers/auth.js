//action types
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
    SET_USER_DETAILS
} = require("../actions/actionTypes");

//initial state 
const initialAuthState = {
    user: {},
    details: false,
    error: null,
    isLoggedIn: false,
    inProgress: false,
    success:null,
    email:'',
    lname:'',
    fname:''
};

export default function auth(state = initialAuthState, action) {
    switch (action.type) {
        //clear msgs
        case CLEAR_AUTH_STATE:
            return {
                ...state,
                error: null,
                success: null,
            };
        case FORGOT_START:
        case LOGIN_START:
        case SIGNUP_START:
            //disable request button
            return {
                ...state,
                inProgress: true,
            };
        case LOGIN_SUCCESS:
            //change state of user to login
            return {
                ...state,
                success: action.success,
                isLoggedIn: true,
                inProgress: false,
                error: null,
                user:{username:action.username,email:action.email,user_id:action.user_id},
            };
        case SIGNUP_SUCCESS:
            //signup success
            return {
                ...state,
                success: action.success,
                inProgress: false,
                error: null,
            };
        case FORGOT_FAILURE:
        case LOGIN_FAILURE:
        case SIGNUP_FAILURE:
            //show msgs to user
            return {
                ...state,
                success:null,
                error: action.error,
                inProgress: false,
            };
        case FORGOT_SUCCESS:
            //mail sent to user to reset password
            return {
                ...state,
                success:action.success,
                error: null,
                inProgress: false,
            };
        case AUTHENTICATE_USER:
            //set user details in user field of redux store
            return {
                ...state,
                user:{username:action.username,email:action.email,user_id:action.user_id},
                isLoggedIn: true,
            };
        case LOG_OUT:
            //remove details of user from user field of redux store
            return {
                ...state,
                user: {},
                isLoggedIn: false,
            };
        case SET_USER_DETAILS:
            //set other user details in redux store
            return {
                ...state,
                email:action.email,
                fname:action.fname,
                lname:action.lname
            }
        default:
            return state;
    }
}
