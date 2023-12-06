import React from "react";
import "../Styles/ProductCard.css";

export default function ProductCard(props) {

  // Returning Product Card with image of the product, name and price details of the products and add to cart button
  return (
    <div>
      {/* Image div for the product card */}
      <div>
        <img src={props.image} alt={props.name} className="productCard-image" />
      </div>
      {/* Product details div for the product card */}
      <div className="product-details">
        <div className="overflow-container">{props.name}</div>
        <span style={{ fontWeight: "700" }}>
          {props.currency} ${props.cost}
        </span>
      </div>

      {/* Add to cart button */}
      <div className="add-to-cart">
        <button style={{width: "100%"}}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
}