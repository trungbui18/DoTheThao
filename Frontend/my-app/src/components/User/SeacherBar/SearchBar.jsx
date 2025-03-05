import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";
import { Link } from "react-router-dom";
import axios from "axios";

function SearchBar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery == "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="product-results">
          {filteredProducts.length >0?
          (filteredProducts.slice(0, 5).map((product) => (
            <Link
              to={`/products/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="product-item">
                <img
                  src={`http://localhost:8080/images/${product.image}`}
                  className="card-img-top img-fluid"
                  alt=""
                  style={{ height: "90px", width: "90px" }}
                />
                <div className="infoProduct">
                  <p className="nameProduct">{product.name}</p>
                  <p className="priceProduct">
                    {product.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
            </Link>
          ))
        ):(searchQuery.trim() !== "" && (
            <p>Không tìm thấy kết quả</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
