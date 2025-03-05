import React, { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
    handleLogout();
  }, [navigate]);
  return null;
}
