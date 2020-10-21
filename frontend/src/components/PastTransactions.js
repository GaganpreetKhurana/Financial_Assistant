import React, {Component} from 'react';
import {connect} from "react-redux";
import {clearAuth, fetchTransactions, updateTransaction} from '../actions/pages';
import TransactionEntry from './TransactionEntry';
import Calendar from 'react-calendar';


class PastTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '0',
            amount: '',
            type: 'true',
            description: '',
            date:'',
            month:'',
            year:''
        };
    }
    handleDate = (event) => {
        console.log("@@@@@@@@@@@@@@@@",event);
        this.setState({date: event});
    }
    handleMonth = (event) => {
        this.setState({Month: event.target.value});
    }
    handleYear = (event) => {
        this.setState({Year: event.target.value});
    }
    handleChange = (event) => {
        this.setState({category: event.target.value});
    }
    handleChange2 = (event) => {
        this.setState({amount: event.target.value});
    }

    handleChange3 = (event) => {
        this.setState({type: event.target.value});
    }
    handleChange4 = (event) => {
        this.setState({description: event.target.value});
    }


    handleSubmit = (e) => {
        //call dispatch
        e.preventDefault();
        const {category, type, description, amount} = this.state;
        this.props.dispatch(updateTransaction(category, type, description, amount, this.props.details.id));

        setTimeout(() => {
            //this.forceUpdate();
            this.props.dispatch(clearAuth());
        }, 50000);

    }
   


    //fetch list of past transactions
    componentDidMount() {
        this.props.dispatch(fetchTransactions());
    }

    componentWillUnmount() {
        this.props.dispatch(clearAuth());
    }
    onChange = date => this.setState({ date })

    render() {
        const {success, error} = this.props.details;

        const {transactions, loading, update, inProgress} = this.props.details;
        if (loading) {
            return <h2>Loading.....</h2>;
        }

        if (transactions.length === 0) {
            return <h2>No Past Transactions to Display</h2>
        }
        return (
            <div className="form-box2">
                <div className="filters">
                    <div className="Leftfilter">
                    <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
                        
                        
                    </div>
                    <div className="Rightfilter">   
                    </div>

                </div>



                {
                    update &&
                    <div>
                        <h2>UPDATE TRANSACTION</h2><br/>
                        <div className="update-box">
                            <div>
                                <label>Choose Category</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <select onChange={this.handleChange} value={this.state.category} placeholder="Category">
                                    <option value="0">Income</option>
                                    <option value="1">Housing</option>
                                    <option value="2">Food</option>
                                    <option value="3">Healthcare</option>
                                    <option value="4">Transportation</option>
                                    <option value="5">Recreation</option>
                                    <option value="6">Miscellaneous</option>
                                    <option value="7">Other</option>
                                </select>
                            </div>
                            <br/>
                            <div>
                                <label>Description</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="text" onChange={this.handleChange4} value={this.state.description}
                                       placeholder="Description" required/>
                            </div>
                            <br/>
                            <div>
                                <label>Enter Amount</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="text" onChange={this.handleChange2} value={this.state.amount}
                                       placeholder="00.00" required/>
                            </div>
                            <br/>
                            <div>
                                <label>Type</label>
                                &nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <select onChange={this.handleChange3} value={this.state.type} placeholder="Type">
                                    <option value="true">Credit</option>
                                    <option value="false">Debit</option>
                                </select>
                            </div>
                            <br/><br/>
                            <button className="save" onClick={this.handleSubmit} disabled={inProgress}>Save</button>


                        </div>
                    </div>
                }
                {update && <br/>}
                <h2>PAST TRANSACTIONS</h2><br/>
                {error && (
                    <div className="alert-warn">
                        <button>{error}</button>
                    </div>
                )}
                {success && (
                    <div className="alert-done">
                        <button>{success}</button>
                    </div>
                )}
                <div className="transaction-entry">
                    <div className="number headers"> S.No.</div>
                    <div className="category headers">Category</div>
                    <div className="amount headers">Amount &nbsp;(Rs.)</div>
                    <div className="type headers">Type</div>
                    <div className="Options headers">Options</div>
                </div>
                <div className="transactions-box">
                    {transactions.map((transaction, index) => (
                        <TransactionEntry transaction={transaction} index={index}
                                          key={`transaction.category-${index}`}/>
                    ))
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        details: state.details,
    };
}

export default connect(mapStateToProps)(PastTransactions);
