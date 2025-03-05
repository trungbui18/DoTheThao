import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ButtonPayment = ({ paymentMethod, order,errorInput }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cartId = JSON.parse(localStorage.getItem("cartId"));
  const cartDetail = JSON.parse(localStorage.getItem("cartDetail")) || [];
  console.log("cartDetail:", cartDetail);
  const orderDetails = cartDetail.map((item) => ({
    price: item.price,
    quantity: item.quantity,
    productId: item.product.id,
    sizeId: item.size.id,
  }));
  const handlePayment = async () => {
    if(Object.keys(errorInput).length>0){
      alert("Thông tin đặt hàng không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/check_availability",
        orderDetails
      );

      if (response.status === 200) {
        console.log("All products are available.");
        if (paymentMethod == 1) {
          localStorage.setItem("order", JSON.stringify(order));
          localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
          console.log("Dữ liệu đã được lưu vào localStorage.");
          const paymentResponse = await axios.post(
            `http://localhost:8080/api/payment/create_payment?price=${order.total_price}`
          );

          if (paymentResponse.data) {
            window.location.href = paymentResponse.data;
          }
        } else {
          const orderResponse = await axios.post(
            "http://localhost:8080/api/createorder",
            null,
            {
              params: {
                name: order.name,
                status: "Đang Chuẩn Bị",
                status_Payment: order.status_Payment || "Unpaid",
                sdt: order.sdt,
                address: order.address,
                total_price: order.total_price,
                userId: order.userId,
              },
            }
          );

          const orderId = orderResponse.data.id;
          for (let item of orderDetails) {
            await axios.post(
              "http://localhost:8080/api/addorderdetails",
              null,
              {
                params: {
                  price: item.price,
                  quantity: item.quantity,
                  productId: item.productId,
                  orderId: orderId,
                  sizeId: item.sizeId,
                },
              }
            );
          }
          await axios.delete(
            `http://localhost:8080/api/delete_by_cartid/${cartId}`
          );
          alert("Đặt hàng thành công");
          localStorage.removeItem("cartDetail");
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const unavailableProducts = error.response.data;
        let alertMessage = "Sản phẩm không đủ số lượng:\n";
        unavailableProducts.forEach((product) => {
          alertMessage += `- ${product.productName} size ${product.sizeDescription} hiện tại chỉ còn ${product.availableQuantity} sản phẩm\n`;
        });
        alert(alertMessage);
      } else {
        console.error("Payment failed:", error);
        alert("Failed to create payment. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-4">
      <button
        type="button"
        className={`btn btn-success btn-lg w-100 ${loading ? "disabled" : ""}`}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          "Pay Now"
        )}
      </button>
    </div>
  );
};

export default ButtonPayment;
