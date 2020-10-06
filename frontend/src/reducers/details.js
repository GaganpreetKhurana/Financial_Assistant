const {SHOW_DETAILS_PAGE,SHOW_CHATBOT_PAGE} = require("../actions/actionTypes");



const initialTransactionState = {
    detailsEntry: false,
    chatBot: false,
    detailsForm: true,
    transactions: [],
};

export default function transaction(state = initialTransactionState, action) {

    switch (action.type) {
        case SHOW_DETAILS_PAGE:
            return {
                ...state,
                detailsForm: true,
                chatBot: false,
            };
        case SHOW_CHATBOT_PAGE:
            return {
                ...state,
                detailsForm: false,
                chatBot: true,
            };
        default:
            return state;

        }
}
