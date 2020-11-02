import React, { Component } from 'react';
import {connect} from "react-redux";
import {Bar} from 'react-chartjs-2';



class GraphBargraph2 extends Component {
    render() {
        return (
            <div>
                <br></br>
                <Bar  
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
                            backgroundColor:'rgba(75,192,192,1)',
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
                            position:'bottom'
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

export default connect(mapStateToProps)(GraphBargraph2);