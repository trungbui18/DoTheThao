import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../components/User/Product/ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../components/User/Footer/Footer";
import Header from "../components/User/Header/Header";

function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/category/${id}`
        );
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [id]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Danh sách sản phẩm</h2>
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={{height:"50vh"}}>Không có sản phẩm trong danh mục này.</div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default CategoryPage;
