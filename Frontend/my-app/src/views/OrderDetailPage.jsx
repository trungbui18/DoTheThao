import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/User/Header/Header";
import Footer from "../components/User/Footer/Footer";
function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idUser = localStorage.getItem("userId");
  const [oder, setOrder] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      const fetchOder = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/orderdetails_orderidKT/${id}`,
            {
              params: { idUser }
            }
          );
          setOrder(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchOder();
    }
  }, [id, token, navigate]);
  const handleBack = () => {
    navigate("/info");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      {oder.length > 0 ? (
        <div className="container-fluid mt-5">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ margin: "10px 20px" }}
          >
            <Link
              to={"/info"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div style={{ fontSize: "26px" }}>&lt; Trở Lại</div>
            </Link>
            <h3>Chi Tiết Đơn Hàng: {id}</h3>
            <></>
          </div>
          <h5 style={{ textAlign: "center" }}>Thông Tin</h5>
          <div
            className="cardInfo bg-light text-dark"
            style={{
              padding: "20px",
            }}
          >
            <div>Tên Khách Hàng: {oder[0].order.name}</div>
            <div>Số Điện Thoại: {oder[0].order.sdt}</div>
            <div>Địa Chỉ: {oder[0].order.address}</div>
          </div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Ảnh</th>
                  <th style={{ textAlign: "center" }}>Tên Sản Phẩm</th>
                  <th style={{ textAlign: "center" }}>Size</th>
                  <th style={{ textAlign: "center" }}>Đơn Giá</th>
                  <th style={{ textAlign: "center" }}>Số Lượng</th>
                  <th style={{ textAlign: "center" }}>Tổng Tiền</th>
                </tr>
              </thead>
              <tbody>
                {oder.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ width: "130px", textAlign: "center" }}>
                        <img
                          src={`http://localhost:8080/images/${item.product.image}`}
                          alt={item.product.name}
                          className="img-fluid"
                          style={{
                            height: "100px",
                            width: "auto",
                            textAlign: "center",
                          }}
                        />
                      </td>
                      <td style={{ width: "420px" }}>{item.product.name}</td>
                      <td style={{ width: "100px", textAlign: "center" }}>
                        <div>{item.size.description}</div>
                      </td>
                      <td style={{ width: "100px", textAlign: "center" }}>
                        <div className="align-items-center">
                          {item.price.toLocaleString("vi-VN")} VND
                        </div>
                      </td>
                      <td style={{ width: "100px", textAlign: "center" }}>
                        <div className="align-items-center">
                          {item.quantity}
                        </div>
                      </td>
                      <td style={{ width: "180px", textAlign: "center" }}>
                        {(item.product.price * item.quantity).toLocaleString(
                          "vi-VN"
                        )}
                        VND
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          <h3>Không tìm thấy!</h3>
          <button
            className="btn btn-danger"
            onClick={handleBack}
            style={{ marginTop: "10px" }}
          >
            Trở lại
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
export default OrderDetailPage;
