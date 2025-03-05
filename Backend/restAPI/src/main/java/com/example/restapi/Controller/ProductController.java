package com.example.restapi.Controller;

import com.example.restapi.entity.*;
import com.example.restapi.exception.NotFoundException;
import com.example.restapi.model.dto.UserDto;
import com.example.restapi.repository.ProductRepository;
import com.example.restapi.repository.ProductSizeRepository;
import com.example.restapi.repository.SizeRepository;
import com.example.restapi.security.SecurityConfig;
import com.example.restapi.service.SizeServiceIpl;
import com.example.restapi.service.productService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping ("/api")
public class ProductController {

    @Qualifier("productServiceImpl")
    @Autowired
    productService service;

    @Autowired
    private SecurityConfig security;

    @Autowired
    private SizeServiceIpl sizeService;
    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductSizeRepository productSizeRepository;


    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        List<product> products = service.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable int id) {
        product product = service.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        else {
            return ResponseEntity.ok(product);
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/countproduct")
    public ResponseEntity<?> getCountProduct() {
        long count= service.countProduct();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/category/{categoryId}")
    public List<product> getProductsByCategory(@PathVariable int categoryId) {
        return service.getProductsByCategory(categoryId);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addproduct")
    public ResponseEntity<String> addProduct(@RequestParam("name") String name,
                                             @RequestParam("description") String description,
                                             @RequestParam("price") int price,
                                             @RequestParam("categoryId") int categoryId,
                                             @RequestParam("image") MultipartFile image,
                                             @RequestParam("images") MultipartFile[] images,
                                             @RequestParam("productsize") String productsizeJson
                                             ) {
        // Tạo đối tượng product và set các thuộc tính
        product product = new product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(new caterogy(categoryId)); // Category phải là một thực thể hợp lệ

        // Lưu hình ảnh chính
        String imagePath = saveImage(image); // Phương thức lưu hình ảnh
        product.setImage(imagePath);

        // Lưu các hình ảnh phụ
        List<productimage> productImages = new ArrayList<>();
        for (MultipartFile img : images) {
            String imageUrl = saveImage(img); // Phương thức lưu hình ảnh
            productimage productImage = new productimage();
            productImage.setImageurl(imageUrl);
            productImage.setProduct(product);
            productImages.add(productImage);
        }
        product.setDetails(productImages);

        ObjectMapper mapper = new ObjectMapper();
        List<ProductSize> productsize = null;
        try {
            productsize = mapper.readValue(productsizeJson, new TypeReference<List<ProductSize>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        product.setProductSizes(productsize);

        for (ProductSize ps : productsize) {
            ps.setProduct(product);  // Gán sản phẩm cho mỗi ProductSize
        }

        service.addProduct(product);
        return ResponseEntity.ok("Sản phẩm đã được thêm thành công!");
    }

    private String saveImage(MultipartFile image) {
        // Lấy tên tệp từ MultipartFile
        String fileName = image.getOriginalFilename();
        // Đảm bảo thư mục "images" tồn tại trong thư mục static
        String uploadDir = "assets/images/";

        // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo thư mục mới
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();  // Tạo thư mục nếu không tồn tại
        }

        // Tạo đường dẫn đầy đủ cho hình ảnh
        Path path = Paths.get(uploadDir + fileName);

        try {
            // Lưu tệp hình ảnh vào thư mục
            Files.write(path, image.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Trả về URL của hình ảnh để sử dụng trong ứng dụng (để hiển thị)
        return fileName;  // Đảm bảo sử dụng đường dẫn phù hợp với Spring Boot
    }



    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteproduct/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        try {
            service.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalStateException ex) {
            // Trả về lỗi 400 Bad Request với thông báo lỗi
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (NotFoundException ex) {
            // Trả về lỗi 404 Not Found với thông báo lỗi
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            // Trả về lỗi 500 Internal Server Error với thông báo chung
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An unexpected error occurred"));
        }
    }



    @PutMapping("/updateproduct/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,  // Lấy ID từ URL
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) Integer categoryId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Integer price,
            @RequestParam(value = "avatar", required = false) String avatar,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam(value = "imagesToRemove", required = false) String imagesToRemoveJson,
            @RequestParam(value = "productsize", required = false) String productSizesJson) {


//        System.out.println("Dữ liệu nhận được: " + productSizesJson);

        product productToUpdate = new product();
        // Cập nhật các trường nếu có giá trị
        if (name != null) {
            productToUpdate.setName(name);
        }
        if (description != null) {
            productToUpdate.setDescription(description);
        }
        if (price != null) {
            productToUpdate.setPrice(price);
        }

        if(avatar != null) {
            productToUpdate.setImage(avatar);
        }

        // Nếu có categoryId, cập nhật danh mục
        if (categoryId != null) {
            caterogy category = new caterogy(categoryId); // Tạo đối tượng category từ ID
            productToUpdate.setCategory(category);
        }

        List<Integer> imagesToRemove = null;
        if (imagesToRemoveJson != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                imagesToRemove = objectMapper.readValue(imagesToRemoveJson, new TypeReference<List<Integer>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi khi giải mã danh sách hình ảnh cần xóa.");
            }
        }

        List<ProductSize> productSizes = null;
        if (productSizesJson != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // Chuyển đổi JSON thành List<ProductSize>
                productSizes = objectMapper.readValue(productSizesJson, new TypeReference<List<ProductSize>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi khi giải mã danh sách ProductSize.");
            }
        }
        // Gọi phương thức service để xử lý logic cập nhật
        product updatedProduct = service.updateProduct(id, productToUpdate, images, imagesToRemove,productSizes);

        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }


    @PostMapping("/check_availability")
    public ResponseEntity<?> checkProductAvailability(@RequestBody List<Map<String, Object>> orderItems) {
        List<Map<String, Object>> unavailableProducts = service.checkProductAvailability(orderItems);

        if (unavailableProducts.isEmpty()) {
            return ResponseEntity.ok("All products are available.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(unavailableProducts);
        }
    }

    @GetMapping("/{id}/check_quantity")
    public ResponseEntity<Map<String, Object>> checkProductQuantity(
            @PathVariable int id, // Nhận ID của orderDetails
            @RequestParam int sizeId,         // Nhận ID của size
            @RequestParam int quantity) {    // Nhận số lượng từ frontend

        // Gọi service để kiểm tra và cập nhật số lượng
        Map<String, Object> response = service.checkProductQuantity(id, sizeId, quantity);

        return ResponseEntity.ok(response);
    }
}
