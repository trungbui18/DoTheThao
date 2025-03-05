import React from "react";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const handleAccount = (e) => {
    navigate("/loginuser");
  };
  return (
    <div>
      <i
        className="pi pi-user"
        style={{ fontSize: "2rem" }}
        onClick={handleAccount}
      ></i>
    </div>
  );
}
