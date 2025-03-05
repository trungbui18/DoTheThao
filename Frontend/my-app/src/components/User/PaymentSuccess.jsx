import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartId = JSON.parse(localStorage.getItem("cartId"));
  const queryParams = new URLSearchParams(location.search);
  const transactionStatus = queryParams.get("vnp_TransactionStatus");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  const processOrder = async () => {
    setLoading(true);
    try {
      if (!hasProcessed && transactionStatus === "00") {
        setHasProcessed(true);
        const order = JSON.parse(localStorage.getItem("order"));
        const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

        if (!order || !orderDetails) {
          throw new Error("Dữ liệu không hợp lệ trong localStorage.");
        }

        const orderResponse = await axios.post(
          "http://localhost:8080/api/createorder",
          null,
          {
            params: {
              name: order.name,
              status: "Đang Chuẩn Bị",
              status_Payment: "Thanh Toán Thành Công",
              sdt: order.sdt,
              address: order.address,
              total_price: order.total_price,
              userId: order.userId,
            },
          }
        );

        const createdOrderId = orderResponse.data.id;

        for (let item of orderDetails) {
          await axios.post("http://localhost:8080/api/addorderdetails", null, {
            params: {
              price: item.price,
              quantity: item.quantity,
              productId: item.productId,
              orderId: createdOrderId,
              sizeId: item.sizeId,
            },
          });
        }
        localStorage.removeItem("order");
        localStorage.removeItem("orderDetails");
        localStorage.removeItem("cartDetail");
        await axios.delete(
          `http://localhost:8080/api/delete_by_cartid/${cartId}`
        );
        console.log("Order và OrderDetails đã được tạo thành công.");
      }
    } catch (err) {
      console.error("Lỗi khi xử lý đơn hàng:", err);
      setError("Đã xảy ra lỗi khi xử lý đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: 4,
          padding: 4,
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          {transactionStatus === "00" ? (
            <CheckCircleOutlineIcon
              sx={{ fontSize: 100, color: "green", marginBottom: 2 }}
            />
          ) : (
            <ErrorOutlineIcon
              sx={{ fontSize: 100, color: "red", marginBottom: 2 }}
            />
          )}

          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: transactionStatus === "00" ? "green" : "red",
            }}
          >
            {transactionStatus === "00"
              ? "Payment Successful"
              : "Payment Failed"}
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#555", marginBottom: 3 }}
          >
            {transactionStatus === "00" ? (
              <>
                Thank you for your payment!
                <br />
              </>
            ) : (
              "The payment was unsuccessful or canceled. Please try again."
            )}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              processOrder();
              navigate("/");
            }}
            sx={{ borderRadius: 3, paddingX: 4, paddingY: 1.5 }}
          >
            Go Back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;
