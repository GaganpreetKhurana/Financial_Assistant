import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import {connect} from "react-redux";


class  GraphLinechart extends Component {

    constructor(props){
        super(props);
        this.state={
            chartData:{
                labels:['Food','HealthCare','Housing','Income','Miscellaneous','Recreation','Transportation','Stocks','Expenditure','Savings'],
                datasets:[{
                    label:'Amount Spent(Rs)',
                    data:[
                        props.food,
                        props.healthcare,
                        props.housing,
                        props.income,
                        props.miscellaneous,
                        props.recreation,
                        props.transportation,
                        props.stock,
                        props.expenditure,
                        props.savings
                    ],
                    backgroundColor:'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',


                }]
            }
        }
    }

    render() {
        return (
                   <div className="update-box" >
                       < Line
                            data={this.state.chartData}
                            options={{
                                title:{
                                    display:true,
                                    text:'Expenditure Pattern',
                                    fontSize:25
                                },
                                legend:{
                                    display:true,
                                    position:'right'
                                }
                            }}
                        />
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

export default connect(mapStateToProps)(GraphLinechart);