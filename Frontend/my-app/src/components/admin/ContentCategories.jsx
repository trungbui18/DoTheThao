import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  Typography,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

const ContentCategories = () => {
  const [categories, setCategories] = useState([]); // Danh sách categories
  const [newCategory, setNewCategory] = useState(""); // Danh mục mới
  const [editCategory, setEditCategory] = useState(null); // Danh mục đang chỉnh sửa
  const [editName, setEditName] = useState(""); // Tên mới khi chỉnh sửa
  const [open, setOpen] = useState(false); // Để mở Dialog xóa
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu category cần xóa

  // Lấy danh sách categories từ backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Thêm category
  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      alert("Tên danh mục không được để trống");
      return;
    }

    axios
      .post("http://localhost:8080/api/addcategories", { name: newCategory })
      .then((response) => {
        setCategories([...categories, response.data]);
        setNewCategory(""); // Reset input
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  // Sửa category
  const handleEditCategory = (id) => {
    if (editName.trim() === "") {
      alert("Tên danh mục không được để trống");
      return;
    }

    axios
      .put(`http://localhost:8080/api/updatecategories/${id}`, {
        name: editName,
      })
      .then((response) => {
        setCategories(
          categories.map((category) =>
            category.id === id ? response.data : category
          )
        );
        setEditCategory(null);
        setEditName("");
      })
      .catch((error) => console.error("Error editing category:", error));
  };

  const handleDeleteCategory = (id) => {
    axios
      .delete(`http://localhost:8080/api/deletecategories/${id}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
        setOpen(false);
      })
      .catch((error) => {
        // Sửa lỗi ở đây
        if (error.response) {
          // Lấy thông báo lỗi từ backend
          const errorMessage =
            error.response.data.message || "An error occurred";
          alert(errorMessage);
        } else {
          alert("Failed to connect to the server.");
        }
        setOpen(false);
      });
  };

  // Mở Dialog xóa
  const handleOpenDialog = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  // Đóng Dialog xóa
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCategory(null);
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
          <Typography variant="h4">Danh Mục</Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", mb: 5 }}>
        <TextField
          label="Tên danh mục mới"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          sx={{ mr: 2, width: "400px" }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "100px" }}
          onClick={handleAddCategory}
        >
          Thêm
        </Button>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 850 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>
                    {editCategory === category.id ? (
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="medium"
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editCategory === category.id ? (
                      <>
                        <Button
                          size="large"
                          color="primary"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          Lưu
                        </Button>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => setEditCategory(null)}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditCategory(category.id);
                            setEditName(category.name);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa danh mục "
            {selectedCategory?.name || "này"}" không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => handleDeleteCategory(selectedCategory.id)}
            color="secondary"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContentCategories;
