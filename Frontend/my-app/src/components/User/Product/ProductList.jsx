import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setCategories(categoryResponse.data);
  
        const productResponse = await axios.get(
          "http://localhost:8080/api/products"
        );
        setProducts(productResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchCategoriesAndProducts();
  }, []);


  return (
    <div className="container mt-4">
      {categories.map((category) => {
        const filteredProducts = products.filter(
          (product) => product&&product.category.id === category.id
        )
        return (
          <div key={category.id}>
            <h5
              style={{
                textAlign: "left",
                paddingBottom: "20px",
                fontWeight: "bold",
              }}
            >
              {category.name}
            </h5>
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
