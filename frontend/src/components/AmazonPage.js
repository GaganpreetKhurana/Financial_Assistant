import React, { Component } from 'react';
import {connect} from "react-redux";
import {fetchWishlist} from "../actions/pages";
import WishlistEntry from './WishlistEntry';




class AmazonPage extends Component {



     //fetch wishlist
     componentDidMount(){ 
        this.props.dispatch(fetchWishlist());
    }


    render() {
    const {wishlist}=this.props.details;

        return (
            <div>
               <h2><br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amazon Wishlist</h2>
               <div className="form-box2">
               <div className="wishlist-entry">
                    <div className="numb headers2"> No. </div>
                    <div className="url headers2">TITLE</div>  
                    <div className="price headers2">Amount &nbsp;(Rs.)</div>
                   
                </div>
               {wishlist.length === 0 && <div><br></br><h2>No Wishlist to display</h2></div>}
               <div className="transactions-box">
                { wishlist.map((entry,index)=>(
                        <WishlistEntry entry={entry} index={index} key={`entry.createdAt-${index}`}/>
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

export default connect(mapStateToProps)(AmazonPage);