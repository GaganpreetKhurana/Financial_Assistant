import React, { Component } from "react";
import { connect } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import amazon_img from "../project_images/amazon.png";
class WishlistEntry extends Component {
  render() {
    const { entry } = this.props;
    return (
      <div>
        <img src={amazon_img} alt="product_img" />
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
