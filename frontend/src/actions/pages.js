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
    SHOW_LINECHART,
    AVG_FETCH_DETAILS
} from './actionTypes';

//show details page to user
export function showDetails()
{
    return{
        type:SHOW_DETAILS_PAGE,
    }
}
//show chat bot page to user
export function showChatBot()
{
    return{
        type:SHOW_CHATBOT_PAGE,
    }
}
//show the past transactions to user
export function viewdetails()
{
    return{
        type:VIEW_DETAILS,
    }
}

//show stock details
export function showStockDetails()
{
    return{
        type:SHOW_STOCK_DETAILS,
    }
}
//show amazon details
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

//disable add transaction button to prevent multiple request by user
export function startTransaction() {
    return {
        type: TRANSACTION_START,
        
    };
}
//transaction failed msg
export function transactionFailed(errormsg) {
    return {
        type: TRANSACTION_FAILURE,
        error: errormsg,
    };
}
//transaction success msg
export function transactionSuccess(successmsg) {
    return {
        type: TRANSACTION_SUCCESS,
        success:successmsg,
    };
}

//add transaction api called
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
                    dispatch(fetchStocklist());
                    return;
                }
                else{
                    dispatch(transactionFailed("Transaction Could not be Added"));
                }
                
            });
    };
}
//msgs cleared on unmounting of the component
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
//past transactions api called
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}

//update transaction
//show update transaction box when user clicks on update
export function showUpdateBox(id)
{
    return {
        type:UPDATE_BOX_SHOW,
        id
    };
}
//update success msg
export function updateTransactionSuccess(msg)
{
    return {
        type:UPDATE_SUCCESS_TRANSACTION,
        success:msg
    };
}
//update failed msg
export function updateTransactionFailure(msg)
{
    return {
        type:UPDATE_FAILURE_TRANSACTION,
        error:msg
    };
}

//update request sent to backend
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
                    dispatch(fetchDetails());
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

//delete success msg
export function deleteSuccess(msg)
{
    return {
        type:DELETE_SUCCESS_TRANSACTION,
        success:msg
    };
}
//delete failed msg
export function deleteFailure(msg)
{
    return {
        type:DELETE_FAILURE_TRANSACTION,
        error:msg
    };
}
//delete request sent to backend
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
                    dispatch(fetchDetails());
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
                dispatch(fetchDetails());
                return;
            }
            else{
                dispatch(deleteFailure("Transaction was not able to delete"));
                return;
            }});
    };


}



//chat bot
//add new msg to chat box
export function addChatMessage(msg)
{
    return {
        type:ADD_CHAT_MESSAGE,
        chatMsg:msg
    };
}
//display past chat msgs
export function displayChatMessage(msg)
{
    return {
        type:DISPLAY_CHAT_MESSAGE,
        chatMsg:msg
    };
}
//sent the user msg to backend
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
                // console.log(data);
                
                if (success) {
                    dispatch(addChatMessage(data));
                    let speak_button=document.getElementsByTagName("button")[7];
                    speak_button.setAttribute("text",data.content);
                    speak_button.click();
                    return;
                }
                else{
                    return;
                }
                
            });
    };

}

//fetch past msgs from backend
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
//show amazon wishlist to user
export function showWishlist(wishlist)
{
    return {
        type:SHOW_WISHLIST,
        wishlist
    };
}

//fetch user amazon wishlist from backend
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
//show stocks list to user
export function showStocklist(stocklist)
{
    return {
        type:SHOW_STOCKLIST,
        stocklist
    };
}

//fetch stocks list for user from backend
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
// details filter for visualization
export function fetchDetailsYear(year){

    return (dispatch) => {
        var success =  false;
        const url = `/details/year/${year}/`;
        
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
                    dispatch(fetchedDetails(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}
//month filter applied
export function fetchDetailsMonth(month){

    return (dispatch) => {
        var success =  false;
        const url = `/details/month/${month}/`;
        
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
                    dispatch(fetchedDetails(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}
//year month filter applied
export function fetchDetailsYearMonth(year,month){

    return (dispatch) => {
        var success =  false;
        const url = `/details/${year}/${month}/`;
        
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
                    dispatch(fetchedDetails(data));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}

// filter transactions
//date month year filter applied
export function filterTransaction1(date,month,year){
    return (dispatch) => {
        var success =  false;
        dispatch(fetchDetailsYearMonth(year,month));
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
//date month filter applied
export function filterTransaction2(date,month){
    return (dispatch) => {
        var success =  false;
        dispatch(fetchDetailsMonth(month));
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
//date year filter applied
export function filterTransaction3(date,year){
    return (dispatch) => {
        var success =  false;
        dispatch(fetchDetailsYear(year));
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}

//month year filter applied
export function filterTransaction4(month,year){
    return (dispatch) => {
        var success =  false;
        dispatch(fetchDetailsYearMonth(year,month));
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}
//date filter applied
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}

//month filter applied
export function filterTransaction6(month){
    return (dispatch) => {
        var success =  false;
        dispatch(fetchDetailsMonth(month));
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
                    dispatch(fetchedTransactions(data.reverse()));
                    return;
                }
                else{
                    dispatch(updateTransactionFailure("Please select appropriate Filters"));
                    return;
                }
                
            });
    };


}

//year filter applied
export function filterTransaction7(year){
    return (dispatch) => {
        var success =  false;
        dispatch(fetchDetailsYear(year));
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
                    dispatch(fetchedTransactions(data.reverse()));
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
//fetch details for visualization
export function fetchDetails(){

    return (dispatch) => {
        var success =  false;
        const url = '/detailslist';
        
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



// fetched avg filter details
export function fetchedAvgDetails(details_week,details_month){
    return {
        type : AVG_FETCH_DETAILS,
        week:details_week,
        month:details_month
    }

}
//average filter
export function avgFilter(start,end){

    return (dispatch) => {
        var success =  false;
        const url = `/transactions/average/${start[2]}/${start[1]}/${start[0]}/${end[2]}/${end[1]}/${end[0]}/`;
        
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
                    dispatch(fetchedAvgDetails(data[0],data[1]));
                    return;
                }
                else{
                    return;
                }
                
            });
    };


}