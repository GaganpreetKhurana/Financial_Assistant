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
    ADD_CHAT_MESSAGE
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
    messages: [{content:"Hii Test_1,Donna this side...",self:false},
        {content:"Hii Donna, Nice to meet you",self:true},
        {content:"So how can I help you ?",self:false},
        {content:"Actually I was looking to buy a Titan watch... So if you could show me the best price available on amazon",self:true},
        {content:"Sure why not..",self:false},
        {content:"So Titan watches start from Rs 2000 and goes upto Rs 100000",self:false},
        {content:"I think according to your current budget and your lavishing lifestyle the one around Rs 25000 would suit you better",self:false},
        {content:"Hmmm that's a bit expensive",self:true},
        {content:"I was looking to spend around 10000 or so..",self:true},
        {content:"Ohh then you should go with 9499 one it covers most of the functionalities and will also suit your budget...",self:false},
        {content:"Yaa that's interesting I would definately go with that one... Bye bye Donna",self:true},
        {content:"Welcome test_1... Looking forward to help you out in future as well",self:false}]
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
        case ADD_CHAT_MESSAGE:
            return {
                ...state,
                messages:[...initialTransactionState.messages,action.chatMsg]
            }
        default:
            return state;

        }
}
