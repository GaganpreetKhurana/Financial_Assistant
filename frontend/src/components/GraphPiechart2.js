import React, { Component } from 'react';
import {connect} from "react-redux";
import {Pie} from 'react-chartjs-2';



class GraphPiechart2 extends Component {
    render() {
        return (
            <div>
                <br></br>
                <Pie 
                    data={{
                        labels:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                            datasets:[{
                                label:'Average Amount Spent(Rs)',
                                data:[
                                    this.props.monday,
                                    this.props.tuesday,
                                    this.props.wednesday,
                                    this.props.thursday,
                                    this.props.friday,
                                    this.props.saturday,
                                    this.props.sunday
                                ],
                            backgroundColor:[
                                'rgba(75,99,132,0.6)',
                                'rgba(54,162,235,0.6)',
                                'rgba(75,192,92,0.6)',
                                'rgba(15,142,56,0.6)',
                                'rgba(255,206,86,0.6)',
                                'rgba(75,192,192,0.6)',
                                'rgba(153,102,255,0.6)',
                            ],
                            borderColor: 'rgba(0,0,0,1)',
                        }]
                    }}
                    options={{
                        title:{
                            display:true,
                            text:'Averaga Expenditure Pattern per Day',
                            fontSize:25
                        },
                        legend:{
                            display:true,
                            position:'right'
                        }
                    }}
            />
            <br></br>
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

export default connect(mapStateToProps)(GraphPiechart2);