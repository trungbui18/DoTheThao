import React, { useEffect, useState } from "react";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  TableHead,
  TableRow,
  TextField,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const OrderDetails = ({ orderId, onClose }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [oldQuantities, setOldQuantities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderDetailsResponse, userResponse] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/orderdetails_orderid/${orderId}`
          ),
          axios.get(`http://localhost:8080/api/userbyorderid/${orderId}`),
        ]);
        const initialQuantities = {};
        orderDetailsResponse.data.forEach((item) => {
          initialQuantities[item.id] = item.quantity;
        });
        setOldQuantities(initialQuantities);
        console.log("old quantity:", oldQuantities);
        setOrderDetails(orderDetailsResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [orderId]);

  const handleSizeChange = (id, newSizeId) => {
    setOrderDetails((prevDetails) =>
      prevDetails.map((item) => {
        if (item && item.id === id) {
          // Cập nhật size của item
          const updatedSize = item.product.productSizes.find(
            (productSize) => productSize.size.id === newSizeId
          );

          // Kiểm tra nếu tìm thấy size mới, cập nhật item
          if (updatedSize) {
            return {
              ...item,
              size: updatedSize.size, // Cập nhật size
            };
          }
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 0) return;

    setOrderDetails((prevDetails) =>
      prevDetails.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleUpdateOrderDetails = async (
    id,
    price,
    quantity,
    productId,
    orderId,
    sizeId
  ) => {
    try {
      const updatedTotalPrice = calculateTotalPrice();
      console.log("id orderDetails:", id);
      console.log("id size:", sizeId);
      console.log("quantity:", quantity);
      if (order.status_Payment !== "Thanh Toán Khi Nhận Hàng") {
        alert("Không thể thay đổi đơn hànghàng! Vì bạn đã thanh toán");
        return;
      }
      if (order.status !== "Đang Chuẩn Bị") {
        alert("Không thể thay đổi đơn hàng! Đơn hàng hiện đang được giao");
        return;
      }
      const checkquanity = await axios.get(
        `http://localhost:8080/api/${id}/check_quantity`,

        {
          params: {
            sizeId,
            quantity,
          },
        }
      );
      const { isEnough, currentQuantity } = checkquanity.data;
      if (!isEnough) {
        alert(
          `Số lượng không đủ, hiện tại trong kho chỉ có ${currentQuantity} sản phẩm.`
        );
        return;
      }

      let sl = 0;
      console.log("quantity: ", oldQuantities);

      // Dùng Object.entries để lấy ra mảng cặp key-value
      const foundQuantity = Object.entries(oldQuantities).find(
        ([key, value]) => key == id // Tìm kiếm theo khóa
      );

      if (foundQuantity) {
        sl = foundQuantity[1]; // Lấy giá trị (quantity) của phần tử tìm được
      }

      console.log("delta:", sl);
      let newQuantity = sl - quantity;
      const response = await axios.put(
        `http://localhost:8080/api/updateorderdetails/${id}`,
        null,
        {
          params: {
            price,
            quantity,
            productId,
            orderId,
            sizeId,
            quantityDelta: newQuantity,
          },
        }
      );

      if (response.status === 200) {
        alert("Cập nhật thành công!");

        // Cập nhật tổng giá trị đơn hàng sau khi cập nhật chi tiết đơn hàng
        await axios.put(
          `http://localhost:8080/api/updateTotalPrice/${orderId}`,
          null,
          {
            params: {
              totalPrice: updatedTotalPrice,
            },
          }
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin đơn hàng:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleDeleteOrderDetail = async (id, orderId, totalDel, order) => {
    try {
      if (order.status_Payment !== "Thanh Toán Khi Nhận Hàng") {
        alert("Không thể xóa! Vì bạn đã thanh toán");
        return;
      }
      if (order.status !== "Đang Chuẩn Bị") {
        alert("Không thể xóa! Đơn hàng hiện đang được giao");
        return;
      }

      if (orderDetails.length <= 1) {
        const confirmDel = window.confirm(
          "Nếu bạn xóa sản phẩm này, bạn sẽ xóa luôn đơn hàng."
        );
        if (!confirmDel) return;
      }

      const response = await axios.delete(
        `http://localhost:8080/api/deleteorderdetails/${id}`
      );

      if (response.status === 200) {
        const updatedTotalPrice = calculateTotalPrice() - totalDel;
        console.log("So tien: ", updatedTotalPrice);

        if (orderDetails.length > 1) {
          await axios.put(
            `http://localhost:8080/api/updateTotalPrice/${orderId}`,
            null,
            {
              params: { totalPrice: updatedTotalPrice },
            }
          );
        } else {
          await axios.delete(
            `http://localhost:8080/api/deleteorder/${orderId}`
          );
        }

        setOrderDetails((prevDetails) =>
          prevDetails.filter((item) => item.id !== id)
        );

        alert("Đã xóa thành công!");
      } else {
        alert("Xóa chi tiết đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
      alert("Xóa chi tiết đơn hàng thất bại!");
    }
  };

  const calculateTotalPrice = () => {
    return orderDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  const order = orderDetails.length > 0 ? orderDetails[0].order : {};

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Chi tiết đơn hàng #{orderId}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <strong>Thông tin đơn hàng:</strong>
              </Typography>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2">Mã đơn hàng: {order.id}</Typography>
                <Typography variant="body2">
                  Tên người nhận: {order.name}
                </Typography>
                <Typography variant="body2">
                  Số điện thoại: {order.sdt}
                </Typography>
                <Typography variant="body2">
                  Địa chỉ: {order.address}
                </Typography>
                <Typography variant="body2">
                  Tổng giá trị: {calculateTotalPrice().toLocaleString()} VND
                </Typography>
                <Typography variant="body2">
                  Ngày tạo: {order.create_at}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <strong>Thông tin khách hàng:</strong>
              </Typography>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2">
                  Mã khách hàng: {user.id}
                </Typography>
                <Typography variant="body2">
                  Tên khách hàng: {user.username}
                </Typography>
                <Typography variant="body2">
                  Số điện thoại: {user.sdt}
                </Typography>
                <Typography variant="body2">Địa chỉ: {user.address}</Typography>
                <Typography variant="body2">
                  Email:
                  {user.email}
                </Typography>
                <Typography variant="body2">
                  Birthday: {user.birthday}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button variant="outlined" onClick={onClose}>
        Quay lại
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>#</strong>
              </TableCell>
              <TableCell>
                <strong>Sản phẩm</strong>
              </TableCell>
              <TableCell>
                <strong>Size</strong>
              </TableCell>
              <TableCell>
                <strong>Giá</strong>
              </TableCell>
              <TableCell>
                <strong>Số lượng</strong>
              </TableCell>
              <TableCell>
                <strong>Tổng</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>{item.product.name}</TableCell>

                {/* Chỉnh sửa Size */}
                <TableCell>
                  <Select
                    value={item.size.id}
                    onChange={(e) => handleSizeChange(item.id, e.target.value)}
                    sx={{
                      minWidth: 80,
                      border: "none", // Ẩn border
                      "& .MuiSelect-select": {
                        padding: "10px", // Thêm padding cho phần chọn trong Select
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // Loại bỏ border của OutlinedInput
                      },
                      "&:focus": {
                        border: "none", // Không hiển thị border khi có focus
                      },
                    }}
                  >
                    {item.product.productSizes.map((productSize) => (
                      <MenuItem
                        key={productSize.id}
                        value={productSize.size.id}
                      >
                        {productSize.size.description}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                <TableCell>{item.price.toLocaleString()} VND</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 60, // Đặt chiều rộng
                      minWidth: 60,
                      border: "none", // Ẩn border
                      "& .MuiSelect-select": {
                        padding: "10px", // Thêm padding cho phần chọn trong Select
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // Loại bỏ border của OutlinedInput
                      },
                      "&:focus": {
                        border: "none", // Không hiển thị border khi có focus
                      },
                    }}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  {(item.price * item.quantity).toLocaleString()} VND
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ marginRight: 1 }}
                    onClick={() =>
                      handleDeleteOrderDetail(
                        item.id,
                        item.order.id,
                        item.price * item.quantity,
                        order
                      )
                    }
                  >
                    delete
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      handleUpdateOrderDetails(
                        item.id,
                        item.price, // Truyền giá trị mới của price (nếu cần thiết)
                        item.quantity, // Truyền số lượng mới (nếu cần thiết)
                        item.product.id, // productId
                        item.order.id, // orderId
                        item.size.id, // sizeId
                        index
                      )
                    }
                  >
                    save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderDetails;
