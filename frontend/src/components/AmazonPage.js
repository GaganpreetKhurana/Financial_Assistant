import React, { Component } from 'react';
import {connect} from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

//actions
import {fetchWishlist} from "../actions/pages";
//component
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
               {wishlist.length === 0 && <div><br></br><h2>No Wishlist to display</h2></div>}
               <div className="transactions-box">
               <Carousel>
                { wishlist.map((entry,index)=>(
                        
                        <WishlistEntry entry={entry} index={index} key={`entry.createdAt-${index}`}/>
                    ))
                }
                </Carousel>
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