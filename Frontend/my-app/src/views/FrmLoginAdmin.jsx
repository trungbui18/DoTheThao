import React, { useState } from "react";
import "../assets/style/styleLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FrmDashboard from "./FrmDashboard";
import MenuAdminHome from "../components/admin/FrmAdminHome";

export default function LoginAdmin() {
  const [userName, setuserName] = useState("");
  const [passWord, setpassWord] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Xử Lý Đăng Nhập
  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      userName: userName,
      pass: passWord,
    };
    console.log("Dữ liệu đăng nhập:", loginData);
    axios
      .post("http://localhost:8080/api/login/login", loginData)
      .then((response) => {
        console.log("Phản hồi từ server:", response);
        console.log("Token nhận được:", response.data.token);
        localStorage.setItem("token", response.data.token);
        return axios.get(`http://localhost:8080/api/user/name/${userName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      })
      .then((response) => {
        console.log("Thông tin admin:", response.data);
        if (response.data.role == 1) {
          localStorage.setItem("role", response.data.role);
          navigate("/FrmDashboard");
        } else {
          alert("Ban khong co quyen truy cap");
        }
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập hoặc lấy thông tin user:", error);
        setErrorMessage("Thông tin đăng nhập không chính xác");
        setpassWord("");
      });
  };

  return (
    <div className="containerlogin">
      <div className="login">
        <div className="content">
          <h2>ADMIN</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              required
              placeholder="Admin"
              className="inputBox"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              required
              placeholder="PassWord"
              className="inputBox"
              value={passWord}
              onChange={(e) => setpassWord(e.target.value)}
              autoComplete="current-password"
            />
            <input
              type="submit"
              className="inputBox"
              id="btnSubmit"
              value="Login"
            />
            {errorMessage && <p className="error">{errorMessage}</p>}
            <br />
          </form>
        </div>
      </div>
    </div>
  );
}
