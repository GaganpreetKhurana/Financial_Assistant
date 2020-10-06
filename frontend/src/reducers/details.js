const {SHOW_DETAILS_PAGE,SHOW_CHATBOT_PAGE,VIEW_DETAILS} = require("../actions/actionTypes");



const initialTransactionState = {
    viewPastDetails: false,
    chatBot: false,
    detailsForm: true,
    transactions: [],
    error:null,
    success:true,
};

export default function transaction(state = initialTransactionState, action) {

    switch (action.type) {
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
        default:
            return state;

        }
}
