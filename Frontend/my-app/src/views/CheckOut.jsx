import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/User/Footer/Footer";
import Header from "../components/User/Header/Header";
import PaymentMethod from "../components/User/PaymentMethod";
function CheckOut() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cartDetail"));
  const [name, setName] = useState(user.username);
  const [sdt, setSdt] = useState(user.sdt);
  const [address, setAddress] = useState(user.address);
  const [errorInput, setErrorInput] = useState({});
  const userId = user.id;
  const navigate = useNavigate();
  useEffect(() => {
    if (!token || !cart) {
      navigate("/");
    }
  }, [token, navigate, cart, user]);
  const tongTien = () => {
    if (cart) {
      return cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    }
  };
  useEffect(() => {
    const err = {};
    if (name.trim().length < 1) {
      err.name = "Nhập tên của bạn!";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(sdt) || phoneRegex.length < 10) {
      err.sdt = "Số điện thoại không đúng định dạng!";
    }
    if (address.trim().length < 10) {
      err.address = "Địa chỉ cần chi tiết hơn!";
    }
    setErrorInput(err);
  }, [address, sdt, name]);
  const info = {
    name: name,
    sdt: sdt,
    address: address,
    total_price: tongTien(),
    userId: userId,
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      {cart && token ? (
        <div className="container-fluid">
          <h2 style={{ paddingTop: "20px" }}>Thanh Toán</h2>
          <div className="row mt-3">
            <div className="col-sm-8">
              <h5 style={{ textAlign: "center" }}>Danh Sách Sản Phẩm</h5>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Ảnh</th>
                      <th style={{ textAlign: "center" }}>Tên Sản Phẩm</th>
                      <th style={{ textAlign: "center" }}>Size</th>
                      <th style={{ textAlign: "center" }}>Số Lượng</th>
                      <th style={{ textAlign: "center" }}>Tổng Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td style={{ width: "130px" }}>
                            <img
                              src={`http://localhost:8080/images/${item.product.image}`}
                              alt={item.product.name}
                              className="img-fluid"
                              style={{ height: "100px", width: "auto" }}
                            />
                          </td>
                          <td style={{ width: "420px" }}>
                            {item.product.name}
                          </td>
                          <td style={{ width: "100px", textAlign: "center" }}>
                            <div>{item.size.description}</div>
                          </td>
                          <td style={{ width: "100px", textAlign: "center" }}>
                            <div className="align-items-center">
                              {item.quantity}
                            </div>
                          </td>
                          <td style={{ width: "180px", textAlign: "center" }}>
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString("Vi-VN")}{" "}
                            VND
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-sm-4">
              <div
                className="cardInfo bg-light text-dark"
                style={{ padding: "20px" }}
              >
                <h5 className="text-center">Thông Tin Khách Hàng</h5>
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Họ Và Tên:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Nhập họ tên của bạn"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errorInput.name && (
                      <div style={{ color: "red" }}>{errorInput.name}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Số Điện Thoại:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Nhập SĐT của bạn"
                      value={sdt}
                      onChange={(e) => setSdt(e.target.value)}
                    />
                    {errorInput.sdt && (
                      <div style={{ color: "red" }}>{errorInput.sdt}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Địa Chỉ Giao Hàng:</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Nhập địa chỉ giao hàng"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errorInput.address && (
                      <div style={{ color: "red" }}>{errorInput.address}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontWeight: "bold" }}
                    >
                      Tổng Tiền Cần Thanh Toán:{" "}
                    </label>
                    <span> {tongTien().toLocaleString("vi-VN")} VND</span>
                  </div>
                  <PaymentMethod info={info} errorInput={errorInput} />
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </div>
  );
}

export default CheckOut;
