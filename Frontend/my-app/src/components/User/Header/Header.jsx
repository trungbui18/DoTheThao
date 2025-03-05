import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import KTlogo from "../../../assets/image/KTlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBasket,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SearchBar from "../SeacherBar/SearchBar";

function Header() {
  const [isDropDown, setIsDropDown] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if(token){
      setIsLoggedIn(true);
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const toggleDropDown = () => {
    setIsDropDown(!isDropDown);
  };

  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };

  const handleGioHang = () => {
    navigate("/cart");
  };
  const handleLoginOrLogout = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      alert("Bạn đã đăng xuất thành công!");
      navigate("/");
    } else {
      navigate("/loginuser");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" id="logoDesktop">
            <img src={KTlogo} className="App-logo" alt="logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand" to="/" id="logoMobile">
            <img src={KTlogo} className="App-logo" alt="logo" />
          </Link>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  TRANG CHỦ
                </Link>
              </li>
              <li className={`nav-item dropdown ${isDropDown ? "show" : ""}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  onClick={() => toggleDropDown()}
                >
                  SẢN PHẨM
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${category.id}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  THÔNG TIN
                </Link>
              </li>
            </ul>
          </div>
          <ul className="navbar-nav" id="logoRight" style={{paddingRight:"60px"}}>
            <li className="nav-item" style={{paddingRight:"0px"}}>
              <button className="nav-link" onClick={openSearchModal}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={handleGioHang}>
                <FontAwesomeIcon icon={faShoppingBasket} />
              </button>
            </li>
            <li
              className="nav-item dropdown"

            >
              <button className="nav-link">
                <FontAwesomeIcon icon={faUser} />
              </button>
              {isLoggedIn && (
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/info">
                    Người Dùng
                  </Link>
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={handleLoginOrLogout}
                  >
                    Đăng xuất
                  </a>
                </div>
              )}
              {!isLoggedIn && (
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/loginuser">
                    Đăng nhập
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <SearchBar isOpen={isSearchModalOpen} onClose={closeSearchModal} />
    </div>
  );
}

export default Header;
