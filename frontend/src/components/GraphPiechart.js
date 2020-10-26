import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import {connect} from "react-redux";


class  GraphPiechart extends Component {

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
                    backgroundColor:[
                        'rgba(75,99,132,0.6)',
                        'rgba(54,162,235,0.6)',
                        'rgba(75,192,92,0.6)',
                        'rgba(15,142,56,0.6)',
                        'rgba(255,206,86,0.6)',
                        'rgba(75,192,192,0.6)',
                        'rgba(153,102,255,0.6)',
                        'rgba(255,159,64,0.6)',
                        'rgba(255,99,132,0.6)',
                        'rgba(155,240,202,0.6)'

                    ],
                    borderColor: 'rgba(0,0,0,1)',


                }]
            }
        }
    }

    render() {
        return (
                   <div className="update-box" >
                       <Pie 
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

export default connect(mapStateToProps)(GraphPiechart);