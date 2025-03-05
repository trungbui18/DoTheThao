import React, { useState, useEffect } from "react";
import ChartOfUser from "./chart/ChartOfUser";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TimelineIcon from "@mui/icons-material/Timeline";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { Card } from "primereact/card";
import "./chart/styleDashBoard/DashboardCard.css";
import axios from "axios";

export default function Content() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countUser, setCountUser] = useState(0);
  const [countProduct, setCountProduct] = useState(0);
  const [inCome, setInCome] = useState(0);
  const [countOrder, setCountOrder] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        const userResponse = await axios.get(
          "http://localhost:8080/api/countuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCountUser(userResponse.data ?? 0);

        const productResponse = await axios.get(
          "http://localhost:8080/api/countproduct",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCountProduct(productResponse.data ?? 0);

        const revenueResponse = await axios.get(
          "http://localhost:8080/api/orders/total_price_today",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInCome(revenueResponse.data ?? 0);

        const orderRespone = await axios.get(
          "http://localhost:8080/api/countorders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCountOrder(orderRespone.data ?? 0);
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy dữ liệu.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const formattedInCome = inCome.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div className="">
      <div className="GroupCard ">
        <Card className="card" id="cardCustomer" title="Khách Hàng">
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p>{countUser} khách hàng</p>
          )}
          <SignalCellularAltIcon className="icon" />
        </Card>
        <Card className="card" id="cardInCome" title="Doanh Thu">
          <p>{formattedInCome}</p>

          <TimelineIcon className="icon" />
        </Card>
        <Card className="card" id="cardOrder" title="Đơn Hàng">
          <p>{countOrder} đơn hàng</p>
          <EqualizerIcon className="icon" />
        </Card>
        <Card className="card" id="cardProduct" title="Sản Phẩm">
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p>{countProduct} sản phẩm</p> // Hiển thị countProduct
          )}
          <TrendingUpIcon className="icon" />
        </Card>
      </div>
    </div>
  );
}
