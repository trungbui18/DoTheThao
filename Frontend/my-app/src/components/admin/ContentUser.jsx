import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Button,
  TableBody,
  Grid,
  Typography,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import AddUser from "./functionUser/addUser";
import EditUser from "./functionUser/editUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ContentUser() {
  // State lưu danh sách user và trạng thái loading
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading khi lấy dữ liệu
  const [error, setError] = useState(null); // Lỗi khi gọi API
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Người dùng hiện tại khi sửa

  // Hàm load dữ liệu từ API
  const handleLoadData = useCallback(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false); // Đã lấy xong dữ liệu
      })
      .catch((error) => {
        setLoading(false);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này?"
    );
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/api/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = "user have an order and can't be deleted";
          alert(errorMessage);
        } else {
          alert("Failed to connect to the server.");
        }
      });
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const handleAddUser = () => {
    handleLoadData();
    setShowAddUser(false);
  };

  // Hàm sửa người dùng
  const handleEditUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setShowEditUser(false);
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: "20px" }}
      >
        <Grid item sx={{ padding: "20px" }}>
          <Typography variant="h4">Khách Hàng</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              showAddUser || showEditUser ? <ArrowBackIcon /> : <AddIcon />
            }
            sx={{ marginRight: 1 }}
            onClick={() => {
              if (showAddUser || showEditUser) {
                setShowAddUser(false);
                setShowEditUser(false);
              } else {
                setShowAddUser(true);
              }
            }}
          >
            {showAddUser || showEditUser ? "Quay lại" : "Thêm"}
          </Button>
        </Grid>
      </Grid>

      {showAddUser ? (
        <AddUser onAddUser={handleAddUser} />
      ) : showEditUser ? (
        <EditUser onEditUser={handleEditUser} user={currentUser} />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Tên</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Ngày Sinh</TableCell>
                <TableCell align="center">SDT</TableCell>
                <TableCell align="left">Chức Năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{user.username}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.birthday}</TableCell>
                  <TableCell align="center">{user.sdt}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: 1 }}
                      onClick={() => {
                        setCurrentUser(user);
                        setShowEditUser(true); // Chuyển sang form sửa người dùng
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(user.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
