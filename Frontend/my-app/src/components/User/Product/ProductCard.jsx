import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
function ProductCard({ product }) {
  return (
    <div className="col-lg-3 col-6 mb-4">
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
        <div className="card">
          <img
            src={`http://localhost:8080/images/${product.image}`}
            className="card-img-top img-fluid"
            alt={product.name}
          />
          <div className="card-body">
            <div style={{ textAlign: "left", fontSize: "15px" }}>
              {product.name}
            </div>
            <div style={{ fontWeight: "bold", textAlign: "left" }}>
              {product.price.toLocaleString("vi-VN")}đ
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
export default ProductCard;
