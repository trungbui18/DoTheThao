import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
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

export default function EditProduct({ onEditProduct, product, onBack }) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category?.id || ""); // ID của loại sản phẩm
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [images, setImages] = useState([]);
  const [detailsImages, setDetailsImages] = useState(product?.details || []);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [categories, setCategories] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]); // Các hình ảnh sẽ bị xóa
  const [combinedImages, setCombinedImages] = useState([]);
  const [productSizes, setProductSizes] = useState(product?.productSizes || []);

  // Hàm gọi API để lấy danh sách các loại sản phẩm
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
  }, []);

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productsize = productSizes.map((size) => ({
      id: size.id,
      size: {
        id: size.size.id, // Giữ lại id của size
        description: size.size.description,
      },
      quantity: size.quantity || 0, // Lấy số lượng của size, mặc định là 0 nếu không có
    }));
    console.log("Giá trị productsize sẽ gửi đi:", productsize);

    let now = new Date();

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0"); // Lấy tháng (thêm 1 vì getMonth() trả về từ 0-11)
    let day = String(now.getDate()).padStart(2, "0");
    let hour = String(now.getHours()).padStart(2, "0");
    let minute = String(now.getMinutes()).padStart(2, "0");
    let second = String(now.getSeconds()).padStart(2, "0");
    let time = `${day}${month}${year}${hour}${minute}${second}`;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("productsize", JSON.stringify(productsize));
      if (combinedImages[0].isNew) {
        const fileName = combinedImages[0].file.name;
        const mainImageName = `${time}_${fileName}`;
        formData.append("avatar", mainImageName);
      } else {
        // Hình ảnh cũ: gửi tên file tách từ URL
        const fullUrl = combinedImages[0].imageurl; // URL đầy đủ
        const fileName = fullUrl.split("/").pop(); // Lấy tên file từ URL
        formData.append("avatar", fileName);
      }

      Array.from(images).forEach((file) => {
        const subImageName = `${time}_${file.name}`;
        formData.append("images", file, subImageName);
      });

      if (imagesToRemove.length > 0) {
        formData.append("imagesToRemove", JSON.stringify(imagesToRemove)); // Chuyển danh sách ID hình ảnh cần xóa thành chuỗi JSON
      }
      const response = await axios.put(
        `http://localhost:8080/api/updateproduct/${product.id}`,
        formData
      );

      if (response.status === 200) {
        setSnackbarMessage("Sản phẩm đã được cập nhật thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        onEditProduct();
        onBack();
      }
    } catch (error) {
      setSnackbarMessage("Có lỗi xảy ra khi cập nhật sản phẩm.");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  // Hàm xóa ảnh cũ
  const handleRemoveImage = (index) => {
    const imageToRemove = detailsImages[index];
    if (!imagesToRemove.includes(imageToRemove.id)) {
      setImagesToRemove((prev) => [...prev, imageToRemove.id]);
    }
    const updatedImages = detailsImages.filter((_, i) => i !== index);
    setDetailsImages(updatedImages);
  };

  // Hàm xóa ảnh mới
  const handleRemoveNewImage = (index) => {
    //kiểm tra
    // console.log("Trước khi xóa - images:", images);
    // console.log("Index to remove:", index);
    // console.log("Length of images:", images.length);
    // console.log("length of detailsImages: ", detailsImages.length);

    const postDelete = index - detailsImages.length;
    const updatedImages = images.filter((_, i) => i !== postDelete);
    console.log("Sau khi xóa - updatedImages:", updatedImages);
    setImages(updatedImages);

    // Cập nhật lại combinedImages sau khi images thay đổi
    setCombinedImages(() => {
      const updatedCombinedImages = [
        ...detailsImages.map((image) => ({ ...image, isNew: false })), // Hình ảnh cũ
        ...updatedImages.map((file) => ({ file, isNew: true })), // Hình ảnh mới
      ];

      console.log("Cập nhật combinedImages:", updatedCombinedImages);
      return updatedCombinedImages;
    });
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = productSizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    setProductSizes(updatedSizes);
  };

  useEffect(() => {
    const newCombinedImages = [
      ...detailsImages.map((detail) => ({ ...detail, isNew: false })), // Hình ảnh cũ
      ...images.map((file) => ({ file, isNew: true })), // Hình ảnh mới
    ];
    setCombinedImages(newCombinedImages); // Cập nhật lại combinedImages
    console.log("Updated images:", images);
  }, [images, detailsImages]);

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: "0px 50px 50px" }}>
        <Typography variant="h4">Sửa Sản Phẩm</Typography>{" "}
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
              <InputLabel shrink={true} sx={{ textAlign: "left" }}>
                Loại Sản Phẩm
              </InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{
                  textAlign: "left",
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    sx={{ textAlign: "left" }}
                  >
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
          {productSizes.map((size, index) => (
            <Grid item xs={6} key={index}>
              <TextField
                label={`Số lượng (Size ${size.size.description})`} // Hiển thị thông tin trong label
                type="number"
                value={size.quantity}
                onChange={(e) =>
                  handleSizeChange(index, "quantity", e.target.value)
                }
                fullWidth
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
              {combinedImages.length > 0 ? (
                combinedImages.map((image, index) => (
                  <div key={index} style={{ margin: "10px" }}>
                    <img
                      src={
                        image.isNew
                          ? URL.createObjectURL(image.file) // Hiển thị ảnh mới qua file
                          : `http://localhost:8080/images/${image.imageurl}` // Hiển thị ảnh cũ từ server
                      }
                      alt={`image-${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      onClick={
                        () => {
                          if (image.isNew == false) {
                            handleRemoveImage(index);
                          } else {
                            handleRemoveNewImage(index);
                          }
                        }
                        // Xử lý xóa ảnh cũ
                      }
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
                  // Kết hợp các file mới với danh sách hiện có
                  setImages((prevImages) => [
                    ...prevImages,
                    ...Array.from(event.target.files),
                  ]);
                }}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Cập Nhật Sản Phẩm
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
