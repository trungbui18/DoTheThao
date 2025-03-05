import React, { useState, useEffect } from "react";
import ProductCard from "./Product/ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";

export default function ProductRecommendations({ idProduct }) {
  const [productRecommendations, setProductRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    // Kiểm tra nếu idProduct có giá trị hợp lệ
    if (idProduct) {
      axios
        .get(`http://localhost:8080/api/recommend?id=${idProduct}`)
        .then((response) => {
          setProductRecommendations(response.data); // Cập nhật danh sách gợi ý
          setLoading(false); // Đặt trạng thái tải là false
        })
        .catch((error) => {
          console.error("Error fetching recommendations:", error);
          setLoading(false); // Dù có lỗi cũng dừng trạng thái tải
        });
    }
  }, [idProduct]); // Gọi lại khi idProduct thay đổi

  if (loading) {
    return <div>Loading recommendations...</div>; // Hiển thị khi đang tải
  }

  return (
    <div>
      <h3>Gợi Ý Sản Phẩm</h3>
      <div className="row">
        {productRecommendations.length > 0 ? (
          productRecommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <li>No recommendations available</li>
        )}
      </div>
    </div>
  );
}
