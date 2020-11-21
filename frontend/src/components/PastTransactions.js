import React, {Component} from 'react';
import {connect} from "react-redux";
//actions
import {
    clearAuth,
    fetchTransactions,
    fetchDetails,
    updateTransaction,
    updateTransactionFailure,
    filterTransaction1,
    filterTransaction2,
    filterTransaction3,
    filterTransaction4,
    filterTransaction5,
    filterTransaction6,
    filterTransaction7,
    showBarGraph,
    showPieChart,
    showLineChart,
    hideGraph
} from '../actions/pages';
//components
import TransactionEntry from './TransactionEntry';
import GraphPiechart from './GraphPiechart';
import GraphLinechart from './GraphLinechart';
import GraphBargraph from './GraphBargraph';



class PastTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '0',
            amount: '',
            type: 'true',
            type2:'false',
            description: '',
            date:'',
            month:'',
            year:'',
            chart:'',
            barGraph:null,
            pieChart:null
        };
    }
    //handle different filters
    handleChart = (event) => {
        this.setState({chart: event.target.value});
    }
    handleDate = (event) => {
        this.setState({date: event.target.value});
    }
    handleMonth = (event) => {
        this.setState({month: event.target.value});
    }
    handleYear = (event) => {
        this.setState({year: event.target.value});
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

    //handle submit button
    handleSubmit = (e) => {
        //call dispatch
        e.preventDefault();
        var {category, type, description, amount} = this.state;
        if(category!=='0' && category !== '6')
        {
            type = this.state.type2;
        }

        this.props.dispatch(updateTransaction(category, type, description, amount, this.props.details.id));
        setTimeout(() => {
            //this.forceUpdate();
            this.props.dispatch(clearAuth());
        }, 50000);

    }

    //handle apply filters button
    handleSubmit2 = (e) => {
        //call dispatch
        e.preventDefault();
        const {date,month,year} = this.state;
        if(date !=='' && month!=='' && year!=='')
        {
            this.props.dispatch(filterTransaction1(date,month,year));
        }
        else if(date !=='' && month!=='')
        {
            this.props.dispatch(filterTransaction2(date,month));
        }
        else if(date !=='' && year!=='')
        {
            this.props.dispatch(filterTransaction3(date,year));
        }
        else if(month !=='' && year!=='')
        {
            this.props.dispatch(filterTransaction4(month,year));
        }
        else if(date !=='')
        {
            this.props.dispatch(filterTransaction5(date));
        }
        else if(month !=='')
        {
            this.props.dispatch(filterTransaction6(month));
        }
        else if(year !=='')
        {
            this.props.dispatch(filterTransaction7(year));
        }
        else{
            this.props.dispatch(updateTransactionFailure("Please select the Filter to be applied first !!!!"))
        }
        this.setState({month:'',date:'',year:''});
        //clear msgs shown to the user
        setTimeout(() => {
            this.props.dispatch(clearAuth());
        }, 10000);

    }

    // handle visualizations button
    // show visualizations
    handleSubmit3 = (e) => {
        //call dispatch
        e.preventDefault();
        const {chart} = this.state;
        if(chart === 'pieChart')
        {
            this.props.dispatch(showPieChart());
            this.setState({pieChart:true,barGraph:null});
        }
        else if(chart === 'barGraph')
        {
            this.props.dispatch(showBarGraph());
            this.setState({barGraph:true,pieChart:null});
        }
        else if(chart === 'lineChart')
        {
            this.props.dispatch(showLineChart());
            this.setState({barGraph:null,pieChart:null});
        }
        else{
            this.props.dispatch(updateTransactionFailure("Please select the Filter to be applied first !!!!"));
            this.setState({
            barGraph:null,
            pieChart:null,
            chart:''})
        }
        setTimeout(() => {
            this.props.dispatch(clearAuth());
        }, 10000);

    }
    //hide visualizations
    handleSubmit4 = (e) => {
        //call dispatch
        e.preventDefault();
        this.props.dispatch(hideGraph());
            this.setState({
            barGraph:null,
            pieChart:null,
            chart:''})
        setTimeout(() => {
            this.props.dispatch(clearAuth());
        }, 10000);

    }


    //fetch list of past transactions
    //fetch list of details for visualization
    componentDidMount() {
        this.props.dispatch(fetchTransactions());
        this.props.dispatch(fetchDetails());
    }
    //clear msgs shown to the user
    componentWillUnmount() {
        this.props.dispatch(clearAuth());
    }
    onChange = date => this.setState({ date })

    render() {
        const {success, error} = this.props.details;
        const {transactions, loading, update, inProgress, piechart,linechart, bargraph,detailsList} = this.props.details;
        var dummy={};
        if(detailsList.length !== 0 )
        {
            dummy=detailsList[detailsList.length -1];
        }
        if (loading) {
            return <h2>Loading.....</h2>;
        }

        return (
            <div className="form-box2">
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
                <div className="filters">
                    <div className="Leftfilter">
                    <select onChange={this.handleDate} value={this.state.date}>
                                    <option value="" disabled>Date</option>
                                    <option value="1">1</option>
                                    <option value="02">2</option>
                                    <option value="03">3</option>
                                    <option value="04">4</option>
                                    <option value="05">5</option>
                                    <option value="06">6</option>
                                    <option value="07">7</option>
                                    <option value="08">8</option>
                                    <option value="09">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                </select>
                                <select onChange={this.handleMonth} value={this.state.month}>
                                <option value="" disabled>Month</option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06"> June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09"> September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                                <select onChange={this.handleYear} value={this.state.year}>
                                <option value="" disabled>Year</option>
                                    <option value="2020">2020</option>
                                </select>
                                <button className="apply" onClick={this.handleSubmit2}>Apply</button>  
                    </div>
                    <div className="Rightfilter">  
                        <select onChange={this.handleChart} value={this.state.chart}>
                            <option value="" disabled>Select Type</option>
                            {(piechart || bargraph || linechart) && 
                            <option value="barGraph" disabled>Bar Graph</option>}
                            {(piechart || bargraph || linechart) &&
                            <option value="pieChart" disabled>Pie Chart</option>}
                            {(piechart || bargraph || linechart) &&
                            <option value="lineChart" disabled>Line Graph</option>}


                            {(!piechart && !bargraph && !linechart) && 
                            <option value="barGraph">Bar Graph</option>}
                            {(!piechart && !bargraph && !linechart) && 
                            <option value="pieChart">Pie Chart</option>}
                            {(!piechart && !bargraph && !linechart) && 
                            <option value="lineChart">Line Graph</option>}
                        </select> 
                            {(!piechart && !bargraph && !linechart) && <button className="show" onClick={this.handleSubmit3}> Show Visualizations </button> }
                            {(piechart || bargraph || linechart) && <button className="hide" onClick={this.handleSubmit4}> Hide Visualizations </button> }

                    </div>
                   
                </div>
                <br></br>
                <br></br>
                {(detailsList.length !== 0 && linechart) && <GraphLinechart
                food={dummy.food}
                healthcare={dummy.healthcare}
                housing={dummy.housing}
                income={dummy.income}
                recreation={dummy.recreation}
                savings = {dummy.savings}
                stock = {dummy.stock}
                transportation = {dummy.transportation}
                expenditure = {dummy.totalExpenditure}
                />}
                {(detailsList.length !== 0 && piechart) && <GraphPiechart
                food={dummy.food}
                healthcare={dummy.healthcare}
                housing={dummy.housing}
                income={dummy.income}
                recreation={dummy.recreation}
                stock = {dummy.stock}
                savings = {dummy.savings}
                transportation = {dummy.transportation}
                expenditure = {dummy.totalExpenditure}
                />}
                {(detailsList.length !== 0 && bargraph) && <GraphBargraph
                food={dummy.food}
                healthcare={dummy.healthcare}
                housing={dummy.housing}
                income={dummy.income}
                recreation={dummy.recreation}
                stock = {dummy.stock}
                savings = {dummy.savings}
                transportation = {dummy.transportation}
                expenditure = {dummy.totalExpenditure}
                />}
                {transactions.length === 0 &&  <h2>No Transactions to Display ..</h2>}

                {
                    update &&
                    <div>
                        <br></br><br></br>
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
                                    <option value="6">Other</option>
                                </select>
                            </div>
                            <br/>
                            <div>
                                <label>Description</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {this.state.category === '6' && (
                                <select onChange={this.handleChange3} value={this.state.type} placeholder="Type">
                                    <option value="true">Credit</option>
                                    <option value="false">Debit</option>
                                </select>)
                                }
                                {this.state.category === '0' && (
                                    <select onChange={this.handleChange3} value={this.state.type} placeholder="Type">
                                        <option value="true">Credit</option>
                                        <option value="false" disabled>Debit</option>
                                    </select>)
                                    }
                                    {(this.state.category !== '6' && this.state.category !== '0' ) && (
                                    <select onChange={this.handleChange3} value={this.state.type2} placeholder="Type">
                                        <option value="false">Debit</option>
                                        <option value="true" disabled>Credit</option>
                                        
                                    </select>)
                                    }
                            </div>
                            <br/><br/>
                            <button className="save" onClick={this.handleSubmit} disabled={inProgress}>Save</button>


                        </div>
                    </div>
                }
               <br></br>
               {transactions.length !== 0 && 
               <div>
                <h2>PAST TRANSACTIONS</h2>
                <br></br>
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
                </div></div>}
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
