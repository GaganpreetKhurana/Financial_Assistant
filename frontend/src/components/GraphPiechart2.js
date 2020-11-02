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
            <Pie 
                    data={{
                        labels:['January','February','March','April','May','June','July','August','September','October','November','December'],
                        datasets:[{
                            label:'Average Amount Spent(Rs)',
                            data:[
                                this.props.january,
                                this.props.february,
                                this.props.march,
                                this.props.april,
                                this.props.may,
                                this.props.june,
                                this.props.july,
                                this.props.august,
                                this.props.september,
                                this.props.october,
                                this.props.november,
                                this.props.december
                            ],
                            backgroundColor:[
                                'rgba(75,99,132,0.6)',
                                'rgba(54,162,235,0.6)',
                                'rgba(75,192,92,0.6)',
                                'rgba(15,142,56,0.6)',
                                'rgba(255,206,86,0.6)',
                                'rgba(75,192,192,0.6)',
                                'rgba(153,102,255,0.6)',
                                'rgba(155,202,92,0.6)',
                                'rgba(125,202,185,0.6)',
                                'rgba(255,159,64,0.6)',
                                'rgba(255,99,132,0.6)',
                                'rgba(155,240,202,0.6)'
                            ],
                            borderColor: 'rgba(0,0,0,1)',
                        }]
                    }}
                    options={{
                        title:{
                            display:true,
                            text:'Averaga Expenditure Pattern per Month',
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