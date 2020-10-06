import {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
} from './actionTypes';


export function showDetails()
{
    return{
        type:SHOW_DETAILS_PAGE,
    }
}

export function showChatBot()
{
    return{
        type:SHOW_CHATBOT_PAGE,
    }
}