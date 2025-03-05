import * as React from "react";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import AddProduct from "./functionProduct/addProduct";
import EditProduct from "./functionProduct/editProduct";
import {
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function ContentProduct() {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false); // State để điều khiển hiển thị form thêm sản phẩm
  const [showEditProduct, setShowEditProduct] = useState(false);

  const handleGetAllProduct = () => {
    axios
      .get("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const productData = response.data.map((product) => ({
          id: product.id,
          image: product.image,
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          details: product.details,
          productSizes: product.productSizes,
        }));
        setProducts(productData);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/api/deleteproduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Xóa sản phẩm thành công", response);
        setProducts(products.filter((product) => product.id !== productId));
      })
      .catch((error) => {
        if (error.response) {
          // Lấy thông báo lỗi từ backend
          const errorMessage =
            error.response.data.message || "An error occurred";
          alert(errorMessage);
        } else {
          alert("Failed to connect to the server.");
        }
      });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditProduct(true);
    handleGetAllProduct();
  };
  const handleAddProduct = () => {
    handleGetAllProduct();
  };

  const handleBack = () => {
    // Quay lại trang danh sách sản phẩm
    setShowAddProduct(false);
    setShowEditProduct(false);
  };

  // Lấy danh sách sản phẩm khi component được render lần đầu
  useEffect(() => {
    handleGetAllProduct();
  }, []);

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: "20px" }}
      >
        <Grid item sx={{ padding: "20px" }}>
          <Typography variant="h4">Sản Phẩm</Typography>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              showAddProduct || showEditProduct ? (
                <ArrowBackIcon />
              ) : (
                <AddIcon />
              )
            }
            sx={{ marginRight: 1 }}
            onClick={() => {
              if (showAddProduct || showEditProduct) {
                // Quay lại nếu đang ở trang thêm hoặc sửa
                setShowAddProduct(false);
                setShowEditProduct(false);
              } else {
                // Hiển thị form thêm sản phẩm nếu không phải ở trang thêm hay sửa
                setShowAddProduct(true);
              }
            }}
          >
            {showAddProduct || showEditProduct ? "Quay lại" : "Thêm"}
          </Button>
        </Grid>
      </Grid>

      {showAddProduct ? (
        <AddProduct onAddProduct={handleAddProduct} onBack={handleBack} />
      ) : showEditProduct ? (
        <EditProduct
          onEditProduct={handleEdit}
          product={currentProduct}
          onBack={handleBack}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Hình Ảnh</TableCell>
                <TableCell>Tên Sản Phẩm</TableCell>
                <TableCell>Loại Sản Phẩm</TableCell>
                {/* <TableCell align="center">Mô Tả</TableCell> */}
                <TableCell>Số Lượng</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Chức Năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={`http://localhost:8080/images/${product.image}`}
                      alt={product.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || "Không rõ"}</TableCell>
                  {/* <TableCell>{product.description}</TableCell> */}
                  <TableCell>
                    {product.productSizes.reduce(
                      (total, size) => total + size.quantity,
                      0
                    )}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEdit(product)}
                    >
                      Chi Tiết
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(product.id)}
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
