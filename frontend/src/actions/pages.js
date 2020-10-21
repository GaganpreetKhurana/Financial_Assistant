import {
    SHOW_DETAILS_PAGE,
    SHOW_CHATBOT_PAGE,
    SHOW_STOCK_DETAILS,
    SHOW_AMAZON_DETAILS,
    VIEW_DETAILS,
    UPDATE_BOX_SHOW,
    UPDATE_SUCCESS_TRANSACTION,
    UPDATE_FAILURE_TRANSACTION,
    TRANSACTION_START,
    TRANSACTION_SUCCESS,
    TRANSACTION_FAILURE,
    CLEAR_AUTH_STATE,
    FETCH_TRANSACTIONS,
    FETCH_TRANSACTION_START,
    DELETE_SUCCESS_TRANSACTION,
    DELETE_FAILURE_TRANSACTION,
    ADD_CHAT_MESSAGE,
    DISPLAY_CHAT_MESSAGE,
    SHOW_WISHLIST,
    SHOW_STOCKLIST,
    FETCH_DETAILS,
    SHOW_BARGRAPH,
    SHOW_PIECHART,
    HIDE_GRAPH,
    SHOW_LINECHART
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
export function showStockDetails()
{
    return{
        type:SHOW_STOCK_DETAILS,
    }
}
export function showAmazonDetails()
{
    return{
        type:SHOW_AMAZON_DETAILS,
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


export function addTransaction(category,credit,description,amount) {
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
                description,
                credit
                }),
        })
            .then((response) => 
            {
                if(response.status === 201){
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
export function showUpdateBox(id)
{
    return {
        type:UPDATE_BOX_SHOW,
        id
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
        error:msg
    };
}


export function updateTransaction(category,credit,description,amount,id){
    return (dispatch) => {
        var success =  false;
        const url =`/update_transaction/${id}/`;
        fetch(url, {
            method: 'PATCH',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            body: getFormBody({
                amount,
                category,
                description,
                credit
                }),
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
                    dispatch(updateTransactionSuccess("Transaction updated successfully"));
                    dispatch(fetchTransactions());
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Transaction was not able to update"));
                    return;
                }
                
            });
    };


}


//delete transaction


export function deleteSuccess(msg)
{
    return {
        type:DELETE_SUCCESS_TRANSACTION,
        success:msg
    };
}
export function deleteFailure(msg)
{
    return {
        type:DELETE_FAILURE_TRANSACTION,
        error:msg
    };
}
export function deleteTransaction(id){
    return (dispatch) => {
        const url =`/delete_transaction/${id}/`;
        var success = false;
        fetch(url, {
            method: 'DELETE',
            headers : {
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            }
        })
        .then((response) => 
        {
            if(response.status === 204){
                success=true;
                return response.json();
            }
            else
            {
                return response.json();
            }
        })
        .then(() => {
                if (success) {
                    dispatch(deleteSuccess("Transaction deleted successfully"));
                    dispatch(fetchTransactions());
                    return;
                }
                else{
                    dispatch(deleteFailure("Transaction was not able to delete"));
                    return;
                }
                
        }).catch(()=>{
            if (success) {
                dispatch(deleteSuccess("Transaction deleted successfully"));
                dispatch(fetchTransactions());
                return;
            }
            else{
                dispatch(deleteFailure("Transaction was not able to delete"));
                return;
            }});
    };


}



//chat bot
export function addChatMessage(msg)
{
    return {
        type:ADD_CHAT_MESSAGE,
        chatMsg:msg
    };
}
export function displayChatMessage(msg)
{
    return {
        type:DISPLAY_CHAT_MESSAGE,
        chatMsg:msg
    };
}
export function newMessage(typedMessage,self)
{
    return (dispatch) => {
        var success =  false;
        const url = '/external/';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:`Bearer ${localStorage.getItem('DONNA')}`
            },
            body: getFormBody({
                content:typedMessage,
                self
                }),
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
                //console.log(data);
                
                if (success) {
                    dispatch(addChatMessage(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };

}


export function pastMessages()
{
    return (dispatch) => {
        var success =  false;
        const url = '/old/';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:`Bearer ${localStorage.getItem('DONNA')}`
            },
            body: getFormBody({
                results:100,
                
                }),
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
                    dispatch(displayChatMessage(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };

}


//wishlist
export function showWishlist(wishlist)
{
    return {
        type:SHOW_WISHLIST,
        wishlist
    };
}


export function fetchWishlist(){

    return (dispatch) => {
        var success =  false;
        const url = '/wishlist/';
        
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
                    dispatch(showWishlist(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}




//stocklist
export function showStocklist(stocklist)
{
    return {
        type:SHOW_STOCKLIST,
        stocklist
    };
}


export function fetchStocklist(){

    return (dispatch) => {
        var success =  false;
        const url = '/stock_list/';
        
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
                    dispatch(showStocklist(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}

// filter transactions
export function filterTransaction1(date,month,year){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/${year}/${month}/${date}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
export function filterTransaction2(date,month){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/month/date/${month}/${date}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
export function filterTransaction3(date,year){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/year/date/${year}/${date}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
export function filterTransaction4(month,year){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/year/month/${year}/${month}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
export function filterTransaction5(date){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/date/${date}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
export function filterTransaction6(month){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/month/${month}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
export function filterTransaction7(year){
    return (dispatch) => {
        var success =  false;
        const url =`/transactions/year/${year}/`;
        fetch(url, {
            method: 'GET',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization : `Bearer ${localStorage.getItem('DONNA')}`
            },
            
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
                    dispatch(updateTransactionSuccess("Filters applied successfully"));
                    dispatch(fetchedTransactions(data));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}


// fetch details
export function fetchedDetails(details){
    return {
        type : FETCH_DETAILS,
        details
    }

}
export function fetchDetails(){

    return (dispatch) => {
        var success =  false;
        const url = '/details/year/2020/';
        
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
                console.log("(((((((((((((((((((",data);
                if (success) {
                    dispatch(fetchedDetails(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}



// show graphs
export function showBarGraph(){
    return {
        type : SHOW_BARGRAPH
    }

}
export function showPieChart(){
    return {
        type : SHOW_PIECHART
    }

}
export function showLineChart(){
    return {
        type : SHOW_LINECHART
    }

}
export function hideGraph(){
    return {
        type:HIDE_GRAPH
    }
}