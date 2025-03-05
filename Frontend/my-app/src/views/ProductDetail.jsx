import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/User/Header/Header";
import Footer from "../components/User/Footer/Footer";
import ProductImage from "../components/User/ProductImage";
import ProductInfo from "../components/User/ProductInfo";
import ProductDescription from "../components/User/ProductDescription";
import ProductRecommendations from "../components/User/ProductRecommendations";
import axios from "axios";
import "../assets/style/Bootstrap";
import "react-toastify/dist/ReactToastify.css";
function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      {product != null ? (
        <div className="container mt-3">
          <div className="row">
            <div className="col-sm-8">
              <ProductImage imageUrls={product.details} />
            </div>
            <div className="col-sm-4">
              <ProductInfo
                name={product.name}
                price={product.price}
                productSizes={product.productSizes}
                productId={id}
              />
            </div>
          </div>
          <ProductDescription description={product.description} />
          <ProductRecommendations idProduct={product.id} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h3>Không tìm thấy sản phẩm !</h3>
          <button
            className="btn btn-danger"
            onClick={handleBack}
            style={{ marginTop: "10px" }}
          >
            Trở về trang chủ
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProductDetail;
