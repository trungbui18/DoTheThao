import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";

import Header from "../components/User/Header/Header";
import Footer from "../components/User/Footer/Footer";

function InfoPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState({});
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthDay] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/${userId}`
        );
        if (response.status === 200) {
          setUser(response.data);
          setEmail(response.data.email);
          setSdt(response.data.sdt);
          setAddress(response.data.address);
          setBirthDay(new Date(response.data.birthday));
          setOrders(response.data.listorders || []);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUser();
  }, [token, userId, navigate]);
  const checkInput = () => {
    const err = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      err.email = "Email không đúng định dạng!";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(sdt) || phoneRegex.length < 10) {
      err.sdt = "Số điện thoại không đúng định dạng!";
    }
    const ngayhientai = new Date().getFullYear();
    const ngaysinh = new Date(birthday).getFullYear();
    if (!birthday || ngayhientai - ngaysinh < 8) {
      err.birthday = "Ngày sinh không hợp lệ phải lớn hơn 7 tuổi";
    }
    if (address.trim().length < 10) {
      err.address = "Địa chỉ cần chi tiết hơn!";
    }
    setError(err);
  };
  useEffect(() => {
    checkInput();
  }, [email, sdt, birthday, address]);

  const handleCapNhat = async (event) => {
    event.preventDefault();
    if (Object.keys(error).length > 0) {
      return;
    }

    const updatedUser = {
      ...user,
      email: email,
      sdt: sdt,
      address: address,
      birthday: birthday,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/update/${userId}`,
        updatedUser
      );

      if (response.status === 200) {
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Error updating user info", error);
      alert("Cập nhật thông tin thất bại!");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid">
        <h2 style={{ paddingTop: "20px" }}>Thông Tin Người Dùng</h2>
        <div className="row mt-3">
          <div className="col-sm-8">
            <h5 style={{ textAlign: "center" }}>Lịch Sử Đơn Hàng</h5>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Mã Đơn Hàng</th>
                  <th style={{ textAlign: "center" }}>Ngày Đặt</th>
                  <th style={{ textAlign: "center" }}>Tổng Tiền</th>
                  <th style={{ textAlign: "center" }}>Trạng Thái</th>
                  <th style={{ textAlign: "center" }}>Chi Tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .slice()
                  .reverse()
                  .map((order) => {
                    return (
                      <tr key={order.id}>
                        <td style={{ textAlign: "center", width: "150px" }}>
                          {order.id}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          {order.create_at}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {order.total_price.toLocaleString("vi-VN")} VND
                        </td>
                        <td style={{ textAlign: "center" }}>{order.status}</td>
                        <td style={{ textAlign: "center" }}>
                          <Link
                            style={{ color: "black" }}
                            to={`/oder-detail/${order.id}`}
                          >
                            Xem Chi Tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="col-sm-4">
            <div
              className="cardInfo bg-light text-dark"
              style={{
                padding: "20px",
              }}
            >
              <h5 style={{ textAlign: "center" }}>Thông Tin Khách Hàng</h5>
              <form
                onSubmit={handleCapNhat}
                style={{ width: "100%", maxWidth: "500px" }}
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error.email && (
                    <div style={{ color: "red" }}>{error.email}</div>
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
                  {error.sdt && <div style={{ color: "red" }}>{error.sdt}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày Sinh:</label>
                  <Calendar
                    placeholder="Chọn ngày sinh"
                    value={birthday}
                    required
                    onChange={(e) => setBirthDay(e.value)}
                  />
                </div>
                {error.birthday && (
                  <div style={{ color: "red" }}>{error.birthday}</div>
                )}
                <div className="mb-3">
                  <label className="form-label">Địa Chỉ:</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Nhập địa chỉ giao hàng"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {error.address && (
                    <div style={{ color: "red" }}>{error.address}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    display: "block",
                    margin: "20px auto",
                  }}
                >
                  Cập Nhật
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default InfoPage;
