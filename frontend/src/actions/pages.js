import {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
    VIEW_DETAILS,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    TRANSACTION_START,
    TRANSACTION_SUCCESS,
    TRANSACTION_FAILURE,
    CLEAR_AUTH_STATE,
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


//Form Body
//converting data in format variable1=key1&variable2=key2...
//this needs to be checked with django api if this format not accepted then send json object
function getFormBody(params) {
    let FormBody = [];
    for (let property in params) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(params[property]);
        FormBody.push(encodedKey + '=' + encodedValue);
    }
    return FormBody.join('&');
}


export function startTransaction() {
    return {
        type: TRANSACTION_START,
        
    };
}

export function transactionFailed(errormsg) {
    return {
        type: TRANSACTION_FAILURE,
        error: errormsg,
    };
}

export function transactionSuccess(successmsg) {
    return {
        type: TRANSACTION_SUCCESS,
        success:successmsg,
    };
}


export function addTransaction(category,type,description,amount) {
    return (dispatch) => {
        var success =  false;
        dispatch(startTransaction());
        const url = '/create_transactions/';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization':`Bearer${localStorage.getItem('DONNA')}`
            },
            body: getFormBody({
                category,
                type,
                description,
                amount
                }),
        })
            .then((response) => 
            {if(response.status === 200){
                success=true;
                return response.json();     
            }else{
                return response.json();
            }})
            .then((data) => {
                if (success) {
                    dispatch(transactionSuccess("Transaction Added Successfully"));
                    return;
                }
                else{
                    dispatch(transactionFailed("Transaction Could not be Added"));
                }
                
            });
    };
}

export function clearAuth() {
    return {
        type: CLEAR_AUTH_STATE,
    };
}