import React, { Component } from "react";
import { connect } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";

class WishlistEntry extends Component {
  render() {
    const { entry } = this.props;
    return (
      <div style={{backgroundColor:"#f1f1f1",border:"2px solid #f1f1f1"}}>
        <img src={entry.image_url} alt="product_img" style={{width:"500px",height:"500px"}} />
        <p className="legend">
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", fontSize: "15px" }}
          >
            {entry.title}
            <br></br>Price - Rs {entry.price}
          </a>
        </p>
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

export default connect(mapStateToProps)(WishlistEntry);
