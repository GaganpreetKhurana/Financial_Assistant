import React, {Component} from 'react';
import {connect} from "react-redux";
//actions
import {addTransaction, clearAuth, fetchStocklist, updateTransactionFailure} from "../actions/pages";


class StockPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: "",
        };
    }

    //handle input fields
    handleAmount = (e) => {
        this.setState({
            amount: e.target.value,
        });
    };
    //handle form submit
    handleSubmitForm = (stock) => {
        const {amount} = this.state;
        if (amount !== '') {
            var category = "7";
            var type = "true";
            var description = stock + " sold";
            this.props.dispatch(addTransaction(category, type, description, amount));

            setTimeout(() => {
                this.props.dispatch(clearAuth());

            }, 10000);
        } else {
            this.props.dispatch(updateTransactionFailure("Please give the right amount !!"))
        }

    };

    //fetch stocklist
    componentDidMount() {
        this.props.dispatch(fetchStocklist());
    }

    render() {
        const {stocklist} = this.props.details;
        const {error, success} = this.props.details;


        return (
            <div>
                <h2>
                    <br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Stocklist
                </h2>
                <div className="form-box2">
                    {error && (
                        <div className="alert-warn">
                            <button>Please give the right amount !!</button>
                        </div>
                    )}
                    {success && (
                        <div className="alert-done">
                            <button>Stocks sold successfully</button>
                        </div>
                    )}

                    <div className="wishlist-entry">
                        <div className="numbs headers"> S.No.</div>
                        <div className="stocks headers">Stocks</div>
                        <div className="owned headers">Owned Stocks(Rs.)</div>
                        <div className="prices headers">Stock Price (Rs.)</div>
                        <div className="sellprices headers">Sell Stocks (Rs.)</div>
                        <div className="numbs headers">Sell</div>

                    </div>
                    {stocklist.length === 0 && <div><br></br><h2>No Stocklist to display</h2></div>}
                    <div className="transactions-box">
                        {stocklist.map((entry, index) => (
                            <div className="transaction-entry" key={`entry.createdAt-${index}`}>
                                <div className="numbs"> &nbsp;&nbsp;{index + 1} </div>
                                <div className="stocks ">&nbsp;&nbsp;&nbsp;&nbsp;{entry.stock}</div>
                                <div
                                    className="owned">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{entry.owned}</div>
                                <div
                                    className="prices">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{entry.current_price}</div>
                                <div className="sellprices"><input type="text" onChange={this.handleAmount}
                                                                   placeholder="Enter Amount(Rs)"/></div>
                                <div className="numbs">
                                    <button onClick={() => this.handleSubmitForm(entry.stock)}>SELL</button>
                                </div>

                            </div>
                        ))
                        }
                    </div>
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

export default connect(mapStateToProps)(StockPage);
