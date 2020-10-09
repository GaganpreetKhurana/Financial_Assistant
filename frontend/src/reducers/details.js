const {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
    VIEW_DETAILS,
    TRANSACTION_START,
    TRANSACTION_FAILURE,
    TRANSACTION_SUCCESS,
    CLEAR_AUTH_STATE,
    FETCH_TRANSACTIONS,
    FETCH_TRANSACTION_START,
    UPDATE_BOX_SHOW
} = require("../actions/actionTypes");



const initialTransactionState = {
    viewPastDetails: false,
    chatBot: false,
    detailsForm: true,
    transactions: [],
    error:null,
    success:null,
    inProgress:false,
    loading:false,
    id:'',
    update:null,
};

export default function transaction(state = initialTransactionState, action) {

    switch (action.type) {
        case FETCH_TRANSACTION_START:
            return {
                ...state,
                loading:true
            }
        case SHOW_DETAILS_PAGE:
            return {
                ...state,
                detailsForm: true,
                chatBot: false,
                viewPastDetails: false,
            };
        case SHOW_CHATBOT_PAGE:
            return {
                ...state,
                detailsForm: false,
                chatBot: true,
                viewPastDetails: false,
            };
        case VIEW_DETAILS:
            return {
                ...state,
                detailsForm: false,
                chatBot: false,
                viewPastDetails:true,

            }
        case TRANSACTION_START:
            return {
                ...state,
                inProgress: true,
            };
        case TRANSACTION_FAILURE:
            return {
                ...state,
                success:null,
                error: action.error,
                inProgress: false,
            };
        case TRANSACTION_SUCCESS:
            return {
                ...state,
                success: action.success,
                inProgress: false,
                error: null,
            };
        case CLEAR_AUTH_STATE:
            return {
                ...state,
                error: null,
                success: null,
            };
        case FETCH_TRANSACTIONS:
            return {
                ...state,
                transactions : action.transactions,
                loading:false,
            }
        case UPDATE_BOX_SHOW:
            return {
                ...state,
                id:action.id,
                update:true,
            }
        default:
            return state;

        }
}
