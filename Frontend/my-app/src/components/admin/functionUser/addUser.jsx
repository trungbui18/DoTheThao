import React, { useState } from "react";
import { TextField, Button, Grid, Snackbar, Alert } from "@mui/material";
import axios from "axios";

export default function AddUser({ onAddUser }) {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const user = {
      username: userName,
      password: passWord,
      email: email,
      birthday: birthDay,
      sdt: phoneNumber,
      address: address,
      role: 0,
    };
    console.log("Người dùng đăng ký: ", user);

    // Gửi dữ liệu qua API
    axios
      .post("http://localhost:8080/api/create", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Thêm User thành công:", response.data);
        onAddUser();
      })
      .catch((error) => {
        console.error("Lỗi khi thêm User:", error);
      });
  };

  return (
    <>
      <h1>Thêm Khách Hàng</h1>
      <form onSubmit={handleSubmit} style={{ padding: "0px 50px 50px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên Người Dùng"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật Khẩu"
              type="password"
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ngày Sinh"
              type="date"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa Chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Thêm User
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
