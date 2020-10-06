import {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
    VIEW_DETAILS,
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

export function viewdetails()
{
    return{
        type:VIEW_DETAILS,
    }
}