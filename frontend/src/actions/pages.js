import {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
    VIEW_DETAILS,
    UPDATE_BOX_SHOW,
    UPDATE_SUCCESS_TRANSACTION,
    UPDATE_FAILURE_TRANSACTION,
    DELETE_TRANSACTION,
    TRANSACTION_START,
    TRANSACTION_SUCCESS,
    TRANSACTION_FAILURE,
    CLEAR_AUTH_STATE,
    FETCH_TRANSACTIONS,
    FETCH_TRANSACTION_START
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
        const url = '/create_transaction';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:`Bearer ${localStorage.getItem('DONNA')}`
            },
            body: getFormBody({
                amount,
                category,
                description
                }),
        })
            .then((response) => 
            {console.log("@@@@@@@@@@@@",response);
                if(response.status === 201){
                success=true;
                return response.json();     
            }else{
                return response.json();
            }})
            .then((data) => {
                console.log("@@@@@@@@@@@@@@@",data);
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

//fetch transactions
export function startFetchTransaction() {
    return {
        type: FETCH_TRANSACTION_START,
        
    };
}
export function fetchedTransactions(transactions){
    return {
        type : FETCH_TRANSACTIONS,
        transactions
    }

}
export function fetchTransactions(){

    return (dispatch) => {
        var success =  false;
        dispatch(startFetchTransaction());
        const url = '/transactions';
        
        fetch(url, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            }
        })
            .then((response) => 
            {
                if(response.status === 200){
                success=true;
                return response.json();     
            }else{
                return response.json();
            }})
            .then((data) => {
                if (success) {
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}

//update transaction
export function showUpdateBox()
{
    return {
        type:UPDATE_BOX_SHOW,
    };
}
export function updateTransactionSuccess(msg)
{
    return {
        type:UPDATE_SUCCESS_TRANSACTION,
        success:msg
    };
}
export function updateTransactionFailure(msg)
{
    return {
        type:UPDATE_FAILURE_TRANSACTION,
        success:msg
    };
}


export function updateTransaction(id){
    return (dispatch) => {
        var success =  false;
        dispatch(showUpdateBox());
        const url =`/update_transaction/${id}`;
        
        fetch(url, {
            method: 'POST',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            }
        })
            .then((response) => 
            {console.log(response);
                if(response.status === 200){
                success=true;
                return response.json();     
            }else{
                return response.json();
            }})
            .then((data) => {
                console.log("@@@@@@@@@@@@@@@@@@",data);
                if (success) {
                    dispatch(updateTransactionSuccess("Transaction updated successfully"));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Transaction was not able to update"));
                    return;
                }
                
            });
    };


}