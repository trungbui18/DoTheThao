import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/User/Header/Header";
import Footer from "../components/User/Footer/Footer";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);
  const cartId = localStorage.getItem("cartId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cartdetails_cartid/${cartId}`
      );
      setCart(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  useEffect(() => {
    if (!token || !cart) {
    } else if (cartId) {
      fetchCart();
    }
  }, [cartId, navigate, token]);

  const sendUpdateToBackend = async (id, size, quantity) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("size", size);
      formData.append("quantity", quantity);
      // console.log("id", id);
      // console.log("size", size);
      // console.log("quan", quantity);
      const response = await axios.put(
        "http://localhost:8080/api/updatecartdetails",
        formData
      );

      console.log("Response from server:", response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert(
            "Số Lượng Sản Phẩm Hiện Tại Còn Lại " + error.response.data + " !"
          );
          const max = parseInt(error.response.data);
          await fetchCart();
          console.log("Dữ liệu cart hiện tại:", cart);
          handleSoLuong(id, max);
        } else {
          console.error("Lỗi từ backend:", error.response.data);
        }
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
      }
    }
  };
  const handleSizeChange = (id, newSize) => {
    const item = cart.find((item) => item.id === id);

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, size: newSize } : item
    );

    setCart(updatedCart);
    sendUpdateToBackend(id, newSize.id, item.quantity);
  };

  const handleSoLuong = (id, newQuantity) => {
    if (newQuantity >= 1 && !isNaN(newQuantity)) {
      const item = cart.find((item) => item.id === id);

      if (!item) {
        console.error("Không tìm thấy sản phẩm với id:", id);
        return;
      }

      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      setCart(updatedCart);

      if (item.size) {
        sendUpdateToBackend(id, item.size.id, newQuantity);
      } else {
        console.error("Không tìm thấy `size` cho sản phẩm:", item);
      }
    }
  };

  const handleTangSoLuong = (id) => {
    const item = cart.find((item) => item.id === id);
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);

    sendUpdateToBackend(id, item.size.id, item.quantity + 1);
  };

  const handleGiamSoLuong = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item.quantity > 1) {
      const updatedCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCart(updatedCart);
      sendUpdateToBackend(id, item.size.id, item.quantity - 1);
    }
  };

  const tongTien = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/deletecartdetails/${id}`
      );
      if (response.status === 200) {
        fetchCart();
        alert(response.data);
      } else {
        console.log("Không thể xóa được !");
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const handleDathang = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/checkCartDetail?id=${cartId}`
      );
      if (response.status === 200) {
        localStorage.setItem("cartDetail", JSON.stringify(response.data));
        navigate("/checkout");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          const dsSanPhamKhongDu = error.response.data;
          let errorMessage = "Các sản phẩm không đủ số lượng:\n";
          dsSanPhamKhongDu.forEach((product) => {
            errorMessage += `- Sản phẩm: ${product.name}, Size: ${product.size}, Số lượng yêu cầu: ${product.soLuongKhachDat}, chỉ còn lại: ${product.soLuongTonKho}\n`;
          });
          alert(errorMessage);
        }
      }
    }
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid" style={{ height: "65vh" }}>
        <h3 className="my-4">Giỏ Hàng Của Bạn</h3>
        {cart && cart.length > 0 ? (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Ảnh</th>
                  <th style={{ textAlign: "center" }}>Tên Sản Phẩm</th>
                  <th style={{ textAlign: "center" }}>Size</th>
                  <th style={{ textAlign: "center" }}>Số Lượng</th>
                  <th style={{ textAlign: "center" }}>Tổng Tiền</th>
                  <th style={{ textAlign: "center" }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: "130px" }}>
                      <img
                        src={`http://localhost:8080/images/${item.product.image}`}
                        alt={item.product.name}
                        className="img-fluid"
                        style={{ height: "100px", width: "auto" }}
                      />
                    </td>
                    <td style={{ width: "420px" }}>{item.product.name}</td>
                    <td style={{ width: "100px" }}>
                      <select
                        className="form-select"
                        value={item.size.id}
                        onChange={(e) => {
                          const selectedSize = item.product.productSizes.find(
                            (sizes) =>
                              sizes.size.id === parseInt(e.target.value)
                          ).size;
                          handleSizeChange(item.id, selectedSize);
                        }}
                      >
                        {item.product.productSizes.map((size) => {
                          const isDisabled =
                            size.quantity === 0 ||
                            cart.some(
                              (cartItem) =>
                                cartItem.product.id === item.product.id &&
                                cartItem.size.id === size.size.id
                            );

                          return (
                            <option
                              key={size.size.id}
                              value={size.size.id}
                              disabled={isDisabled}
                            >
                              {size.size.description}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td style={{ width: "100px", textAlign: "center" }}>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary"
                          style={{ marginLeft: "30px" }}
                          onClick={() => handleGiamSoLuong(item.id)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            handleSoLuong(item.id, newQuantity);
                          }}
                          style={{
                            width: "60px",
                            textAlign: "center",
                            margin: "0 5px",
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleTangSoLuong(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ width: "180px" }}>
                      {(item.product.price * item.quantity).toLocaleString(
                        "Vi-VN"
                      )}{" "}
                      VND
                    </td>
                    <td style={{ width: "100px", textAlign: "center" }}>
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => handleDelete(item.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <h3 style={{ paddingRight: "10px" }}>Tổng cộng: </h3>
                <h3 style={{ color: "#1976D2" }}>
                  {tongTien().toLocaleString("vi-VN")} VND
                </h3>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleDathang}
              >
                Đặt Hàng
              </button>
            </div>
          </div>
        ) : (
          <h3 style={{ height: "50vh" }}>Giỏ hàng đang trống</h3>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
