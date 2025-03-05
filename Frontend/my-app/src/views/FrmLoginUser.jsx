import React, { useState, useEffect } from "react";
import "../assets/style/styleLogin.css";
import axios from "axios";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";

export default function LoginUser() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userNameLog, setUserNameLog] = useState("");
  const [passWordLog, setPassWordLog] = useState("");
  const [userName, setUsername] = useState("");
  const [passWord, setPassWord] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [addRess, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sdt, setSdt] = useState("");

  const navigate = useNavigate();

  // Xử Lý Đăng Ký User
  const handleSignupUser = (e) => {
    e.preventDefault();
    if (!userName || !passWord || !email || !birthDay || !addRess || !sdt) {
      alert("All fields are required!");
      return;
    }

    // Kiểm tra độ dài của password (ví dụ ít nhất 6 ký tự)
    if (passWord.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    // Kiểm tra định dạng email hợp lệ
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const ngayhientai = new Date().getFullYear();
    const ngaysinh = new Date(birthDay).getFullYear();
    if (!birthDay || ngayhientai - ngaysinh < 8) {
      alert("Ngày sinh không hợp lệ phải lớn hơn 7 tuổi");
      return;
    }
    if (addRess.trim().length < 10) {
      alert("Địa chỉ cần chi tiết hơn!");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(sdt) || phoneRegex.length < 10) {
      alert("Số điện thoại không đúng định dạng!");
      return;
    }
    const user = {
      username: userName,
      password: passWord,
      email: email,
      birthday: birthDay,
      sdt: sdt,
      address: addRess,
      role: 0,
    };
    console.log("Nugoi dung dang ky: ", user);

    axios
      .post("http://localhost:8080/api/create", user)
      .then((response) => {
        alert("Đăng Ký thành công");
        setIsSignIn(true);
      })
      .catch((error) => {
        console.error("Đã có lỗi xảy ra:", error);
        alert("Đăng ký thất bại, vui lòng thử lại!");
      });
  };

  // Xử Lý Đăng Nhập
  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định

    const loginData = {
      userName: userNameLog,
      pass: passWordLog,
    };

    console.log("Dữ liệu đăng nhập:", loginData);

    axios
      .post("http://localhost:8080/api/login/login", loginData)
      .then((response) => {
        console.log("Phản hồi từ server:", response);
        console.log("Token nhận được:", response.data.token);
        localStorage.setItem("token", response.data.token);
        return axios.get(`http://localhost:8080/api/user/name/${userNameLog}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      })
      .then((response) => {
        if (response.data.role == 0) {
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/");
          alert("Đăng Nhập Thành Công ");
          console.log("Thông tin user:", response.data);
          localStorage.setItem("userId", response.data.id);
          if (response.data.cart && response.data.cart.id) {
            localStorage.setItem("cartId", response.data.cart.id);
          } else {
            localStorage.setItem("cartId", null);
          }
        } else {
          alert("Ban khong co quyen truy cap");
        }
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập hoặc lấy thông tin user:", error);
        setErrorMessage("Thông tin đăng nhập không chính xác");
        setPassWordLog("");
      });
  };

  //Xử Lý chuyển đổi thành sign in thành sign up
  const handleSignUp = (e) => {
    e.preventDefault();
    setUserNameLog("");
    setPassWordLog("");
    setIsSignIn(false);
  };

  //Xử Lý chuyển đổi thành sign up thành sign in
  const handleSignIn = (e) => {
    e.preventDefault();
    setUsername("");
    setPassWord("");
    setBirthDay("");
    setEmail("");
    setAddress("");
    setIsSignIn(true);
  };

  return (
    // đăng nhập user
    <div className="containerlogin">
      {isSignIn ? (
        <div className="login">
          <div className="content">
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                required
                placeholder="User name"
                className="inputBox"
                value={userNameLog}
                onChange={(e) => setUserNameLog(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="passWord"
                className="inputBox"
                value={passWordLog}
                onChange={(e) => setPassWordLog(e.target.value)}
              />
              <input
                type="submit"
                className="inputBox"
                id="btnSubmit"
                value="Login"
              />
              {errorMessage && <p className="error">{errorMessage}</p>}
              <a href="#" onClick={(e) => handleSignUp(e)}>
                Signup
              </a>
              <br />
            </form>
          </div>
        </div>
      ) : (
        // đăng ký user
        <div className="login">
          <div className="content">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupUser}>
              <input
                type="text"
                required
                placeholder="User name"
                className="inputBox"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                className="inputBox"
                value={passWord}
                onChange={(e) => {
                  setPassWord(e.target.value);
                }}
              />
              <input
                type="email"
                required
                placeholder="Email"
                className="inputBox"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Calendar
                placeholder="Your BirthDay"
                required
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Address"
                className="inputBox"
                value={addRess}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
              <input
                type="text"
                required
                placeholder="Phone Number"
                className="inputBox"
                value={sdt}
                onChange={(e) => {
                  setSdt(e.target.value);
                }}
              />
              <input
                type="submit"
                className="inputBox"
                id="btnSubmit"
                value="Register"
              />
              <a href="#" onClick={(e) => handleSignIn(e)}>
                Sign In
              </a>
              <br />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
