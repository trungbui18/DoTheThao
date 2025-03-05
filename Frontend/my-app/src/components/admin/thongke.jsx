import React, { useState } from "react";
import axios from "axios";
import { Calendar } from "primereact/calendar";

export default function Thongke() {
  const [ngaydau, setNgaydau] = useState(null); // Ngày bắt đầu
  const [ngayKetthuc, setNgayketthuc] = useState(null); // Ngày kết thúc
  const [inCome, setInCome] = useState(0); // Doanh thu
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCalculateRevenue = async () => {
    if (!ngaydau || !ngayKetthuc) {
      setErrorMessage("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/api/orders/total_price_today",
        {
          params: {
            startDate: formatDate(ngaydau),
            endDate: formatDate(ngayKetthuc),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInCome(response.data);
      setErrorMessage("");
    } catch (err) {
      console.error("Error calculating revenue:", err);
      setErrorMessage("Đã xảy ra lỗi khi tính doanh thu.");
    }
  };

  return (
    <div className="revenue">
      <h2>Tính Doanh Thu</h2>
      <div>
        <label>Ngày Bắt Đầu: </label>
        <Calendar
          value={ngaydau}
          onChange={(e) => setNgaydau(e.value)}
          placeholder="Chọn ngày bắt đầu"
        />
      </div>
      <div>
        <label>Ngày Kết Thúc: </label>
        <Calendar
          value={ngayKetthuc}
          onChange={(e) => setNgayketthuc(e.value)}
          placeholder="Chọn ngày kết thúc"
        />
      </div>
      <button onClick={handleCalculateRevenue}>Tính Doanh Thu</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <h3>Tổng Doanh Thu: {inCome} VNĐ</h3>
    </div>
  );
}
