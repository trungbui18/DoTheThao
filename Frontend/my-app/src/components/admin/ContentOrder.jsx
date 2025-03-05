import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import OrderDetails from "./functionOrder/OrderDetails";

const ContentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showCompletedOrders, setShowCompletedOrders] = useState(false); // State để hiển thị đơn đã hoàn thành

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/updatestatus/${orderId}/status`,
        null,
        { params: { status } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseDetails = () => {
    setSelectedOrderId(null);
    fetchOrders();
  };

  if (selectedOrderId !== null) {
    return (
      <OrderDetails orderId={selectedOrderId} onClose={handleCloseDetails} />
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredOrders = showCompletedOrders
    ? orders.filter((order) => order.status === "Hoàn Tất")
    : orders.filter((order) => order.status !== "Hoàn Tất");

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" align="center" gutterBottom sx={{ margin: 2 }}>
        Danh sách đơn hàng
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setShowCompletedOrders(!showCompletedOrders)}
        >
          {showCompletedOrders ? "Đơn chưa hoàn thành" : "Đơn đã hoàn thành"}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>ID</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái thanh toán</strong>
            </TableCell>
            <TableCell>
              <strong>Số điện thoại</strong>
            </TableCell>
            <TableCell>
              <strong>Tổng giá</strong>
            </TableCell>
            <TableCell>
              <strong>Ngày tạo</strong>
            </TableCell>
            <TableCell>
              <strong>Chức năng</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders
            .slice()
            .reverse()
            .map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Select
                    value={order.status || ""}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    displayEmpty
                    sx={{
                      minWidth: 150,
                      border: "none",
                      "& .MuiSelect-select": {
                        padding: "10px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:focus": {
                        border: "none",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Chưa cập nhật
                    </MenuItem>
                    <MenuItem value="Đang Chuẩn Bị">Đang Chuẩn Bị</MenuItem>
                    <MenuItem value="Đang Giao">Đang Giao</MenuItem>
                    <MenuItem value="Hoàn Tất">Hoàn Tất</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{order.status_Payment}</TableCell>
                <TableCell>{order.sdt || "Không có"}</TableCell>
                <TableCell>
                  {order.total_price.toLocaleString("vi-VN")} VND
                </TableCell>
                <TableCell>{order.create_at}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContentOrder;
