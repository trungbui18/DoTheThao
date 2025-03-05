import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddProduct({ onAddProduct, onBack }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // Đây là ID của loại sản phẩm
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]); // Tất cả các hình ảnh đã chọn
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [categories, setCategories] = useState([]); // Dữ liệu từ API
  const [availableSizes, setAvailableSizes] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });

  // Gọi API để lấy danh sách loại sản phẩm
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
      });

    axios
      .get("http://localhost:8080/api/sizes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setAvailableSizes(response.data); // Lưu các size vào state
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách size:", error);
      });
  }, []); // Chạy 1 lần khi component mount

  const handleSubmit = (e) => {
    e.preventDefault();
    const productsize = availableSizes.map((size) => ({
      size: {
        id: size.id,
        description: size.description,
      },
      quantity: sizeQuantities[size.description] || 0,
    }));
    let now = new Date();

    let year = now.getFullYear(); // Lấy năm
    let month = String(now.getMonth() + 1).padStart(2, "0"); // Lấy tháng (thêm 1 vì getMonth() trả về từ 0-11)
    let day = String(now.getDate()).padStart(2, "0"); // Lấy ngày
    let hour = String(now.getHours()).padStart(2, "0"); // Lấy giờ
    let minute = String(now.getMinutes()).padStart(2, "0"); // Lấy phút
    let second = String(now.getSeconds()).padStart(2, "0"); // Lấy giây

    // Kết hợp thành chuỗi
    // đang xử lý time
    let time = `${day}${month}${year}${hour}${minute}${second}`;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", category);
    formData.append("productsize", JSON.stringify(productsize));
    // Thêm hình ảnh chính vào formData với tên có đính kèm timestamp
    if (images && images[0]) {
      const mainImage = images[0];
      const mainImageName = `${time}_${mainImage.name}`; // Tên mới của hình ảnh chính
      formData.append("image", mainImage, mainImageName); // Đính kèm tên mới
    }

    // Thêm các hình ảnh phụ vào formData với tên có đính kèm timestamp
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const subImage = images[i];
        const subImageName = `${time}_${subImage.name}`; // Tên mới của từng hình ảnh phụ
        formData.append("images", subImage, subImageName); // Đính kèm tên mới
      }
    }

    axios
      .post("http://localhost:8080/api/addproduct", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setSnackbarMessage("Thêm sản phẩm thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        onAddProduct();
        onBack();
      })
      .catch((error) => {
        setSnackbarMessage("Lỗi khi thêm sản phẩm.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("Lỗi khi thêm sản phẩm:", error);
      });
  };

  // Hàm xóa hình ảnh
  const handleRemoveImage = (index) => {
    // Xóa hình ảnh tại vị trí index
    const newImages = [...images]; // Sao chép mảng images để tránh thay đổi trực tiếp trạng thái
    newImages.splice(index, 1); // Xóa hình ảnh tại index
    setImages(newImages); // Cập nhật lại trạng thái hình ảnh
  };
  const handleQuantityChange = (e, size) => {
    const value = e.target.value;
    setSizeQuantities((prevQuantities) => ({
      ...prevQuantities,
      [size]: value, // Cập nhật số lượng cho kích thước tương ứng
    }));
  };
  return (
    <>
      <h1>Thêm Sản Phẩm</h1>
      <form onSubmit={handleSubmit} style={{ padding: "0px 50px 50px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên Sản Phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Loại Sản Phẩm</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô Tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={8} // Số dòng hiển thị mặc định
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Giá"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              required
            />
          </Grid>
          {availableSizes.map((size) => (
            <Grid item xs={6} key={size.id}>
              <TextField
                fullWidth
                label={`Số Lượng Size ${size.description}`}
                value={sizeQuantities[size.description]} // Hiển thị giá trị từ state
                onChange={(e) => handleQuantityChange(e, size.description)} // Cập nhật state khi thay đổi
                type="number"
                required
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <h3>Hình Ảnh Chi Tiết</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {images.length > 0 ? (
                Array.from(images).map((image, index) => (
                  <div key={index} style={{ margin: "10px" }}>
                    <img
                      src={URL.createObjectURL(image)} // Tạo URL tạm thời cho hình ảnh
                      alt={`detail-image-${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        cursor: "pointer", // Thêm con trỏ chuột dạng 'pointer' để người dùng biết hình ảnh có thể nhấn
                      }}
                      onClick={() => handleRemoveImage(index)} // Xử lý xóa hình ảnh khi nhấn
                    />
                  </div>
                ))
              ) : (
                <p>Không có hình ảnh chi tiết.</p>
              )}
            </div>
          </Grid>

          <Grid item xs={12}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload More Images
              <VisuallyHiddenInput
                type="file"
                multiple
                onChange={(event) => {
                  const newImages = Array.from(event.target.files); // Chuyển đổi FileList thành mảng
                  setImages((prevImages) => [...prevImages, ...newImages]); // Kết hợp hình ảnh mới với hình ảnh đã có
                }}
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Thêm Sản Phẩm
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
