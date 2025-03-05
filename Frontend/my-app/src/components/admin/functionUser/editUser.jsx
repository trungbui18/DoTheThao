import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function EditUser({ onEditUser, user }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chuyển đổi props thành state khi component được render
  useEffect(() => {
    if (user) {
      setUserName(user.username);
      setEmail(user.email);
      setBirthDay(user.birthday);
      setAddress(user.address);
      setPhoneNumber(user.sdt);
    }
  }, [user]);

  // Hàm xử lý khi nhấn nút lưu
  const handleSave = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log({
      id: user.id,
      username: userName,
      email: email,
      birthday: birthDay,
      sdt: phoneNumber,
      address: address,
      listorders: [],
      role: 0,
    });

    axios
      .put(
        `http://localhost:8080/api/update/${user.id}`,
        {
          username: userName,
          email: email,
          birthday: birthDay,
          sdt: phoneNumber,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        alert("Cập Nhật Thành Công");
        onEditUser(response.data); // Cập nhật người dùng trong danh sách
      })
      .catch((error) => {
        setLoading(false);
        setError("Có lỗi xảy ra khi cập nhật người dùng.");
        console.error("Error updating user:", error);
      });
  };

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUserName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "birthday":
        setBirthDay(value);
        break;
      case "phonenumber":
        setPhoneNumber(value);
        break;
      case "address":
        setAddress(value);
        break;
      default:
        break;
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ padding: "20px" }}
    >
      <Typography variant="h4">Chỉnh Sửa Khách Hàng</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid item sx={{ width: "100%", marginBottom: "20px" }}>
        <TextField
          label="Tên Người Dùng"
          variant="outlined"
          fullWidth
          name="username"
          value={userName}
          onChange={handleChange}
        />
      </Grid>

      <Grid item sx={{ width: "100%", marginBottom: "20px" }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={email}
          onChange={handleChange}
        />
      </Grid>

      <Grid item sx={{ width: "100%", marginBottom: "20px" }}>
        <TextField
          label="Ngày Sinh"
          variant="outlined"
          fullWidth
          name="birthday"
          value={birthDay}
          onChange={handleChange}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item sx={{ width: "100%", marginBottom: "20px" }}>
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="phonenumber"
          value={phoneNumber}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sx={{ width: "100%", marginBottom: "20px" }}>
        <TextField
          label="Địa Chỉ"
          variant="outlined"
          fullWidth
          name="address"
          value={address}
          onChange={handleChange}
        />
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
          onClick={handleSave} // Lưu thông tin người dùng đã sửa
          disabled={loading}
        >
          Lưu
        </Button>
      </Grid>
    </Grid>
  );
}
