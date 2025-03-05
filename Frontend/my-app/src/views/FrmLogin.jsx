import React, { useState } from "react";
import "../assets/style/styleLogin.css";
import axios from "axios";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate("/loginuser");
  };

  const handleAdminLogin = () => {
    navigate("/loginadmin");
  };
  return (
    <div className="containerlogin">
      <div className="login">
        <div className="contentFormLogin">
          <h2>LOGIN</h2>
          <div className="GRbtnLogin">
            <div className="GRbtnLogin">
              <Button
                label="USER"
                icon="pi pi-user"
                severity="success"
                size="large"
                onClick={handleUserLogin}
              />

              <Button
                label="ADMIN"
                icon="pi pi-address-book"
                severity="warning"
                size="large"
                onClick={handleAdminLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
