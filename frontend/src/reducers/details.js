const {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
    VIEW_DETAILS,
    SHOW_STOCK_DETAILS,
    SHOW_AMAZON_DETAILS,
    TRANSACTION_START,
    TRANSACTION_FAILURE,
    TRANSACTION_SUCCESS,
    CLEAR_AUTH_STATE,
    FETCH_TRANSACTIONS,
    FETCH_TRANSACTION_START,
    UPDATE_BOX_SHOW,
    UPDATE_SUCCESS_TRANSACTION,
    UPDATE_FAILURE_TRANSACTION,
    DELETE_SUCCESS_TRANSACTION,
    DELETE_FAILURE_TRANSACTION,
    ADD_CHAT_MESSAGE,
    DISPLAY_CHAT_MESSAGE,
    SHOW_WISHLIST,
    SHOW_STOCKLIST,
    FETCH_DETAILS,
    SHOW_PIECHART,
    SHOW_BARGRAPH,
    HIDE_GRAPH,
    SHOW_LINECHART
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
    stock:false,
    amazon:false,
    messages: [],
    wishlist: [],
    stocklist:[],
    detailsList:[],
    piechart:null,
    bargraph:null,
    linechart:null,
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
                stock:false,
                amazon:false
            };
        case SHOW_STOCK_DETAILS:
            return {
                ...state,
                detailsForm: false,
                chatBot: false,
                viewPastDetails: false,
                stock:true,
                amazon:false
            };
        case SHOW_AMAZON_DETAILS:
            return {
                ...state,
                detailsForm: false,
                chatBot: false,
                viewPastDetails: false,
                stock:false,
                amazon:true
            };
        case SHOW_CHATBOT_PAGE:
            return {
                ...state,
                detailsForm: false,
                chatBot: true,
                viewPastDetails: false,
                stock:false,
                amazon:false
            };
        case VIEW_DETAILS:
            return {
                ...state,
                detailsForm: false,
                chatBot: false,
                viewPastDetails:true,
                stock:false,
                amazon:false
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
        case FETCH_DETAILS:
            return {
                ...state,
                detailsList:action.details,
            }
        case CLEAR_AUTH_STATE:
            return {
                ...state,
                error: null,
                success: null,
                update:null,
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
        case DELETE_SUCCESS_TRANSACTION:
        case UPDATE_SUCCESS_TRANSACTION:
            return{
                ...state,
                id:'',
                update:null,
                success:action.success,
                error:null
            }
        case DELETE_FAILURE_TRANSACTION:
        case UPDATE_FAILURE_TRANSACTION:
            return{
                ...state,
                id:'',
                update:null,
                error:action.error,
                success:null
            }
        case DISPLAY_CHAT_MESSAGE:
            return {
                ...state,
                messages:action.chatMsg
            }

        case ADD_CHAT_MESSAGE:
            return {
                ...state,
                messages:[...state.messages,action.chatMsg]
            }
        case SHOW_WISHLIST:
            return {
                ...state,
                wishlist:action.wishlist
            }
        case SHOW_STOCKLIST:
            return {
                ...state,
                stocklist:action.stocklist
            }
        case SHOW_BARGRAPH:
            return {
                ...state,
                bargraph:true,
                piechart:null,
                linechart:null
            }
        case SHOW_PIECHART:
            return {
                ...state,
                bargraph:null,
                piechart:true,
                linechart:null
            }
        case SHOW_LINECHART:
            return {
                ...state,
                bargraph:null,
                piechart:null,
                linechart:true
            }
        case HIDE_GRAPH:
            return {
                ...state,
                bargraph:null,
                piechart:null,
                linechart:null
            }
        default:
            return state;
    }
}
