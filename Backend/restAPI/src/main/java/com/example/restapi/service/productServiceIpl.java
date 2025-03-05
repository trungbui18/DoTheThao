package com.example.restapi.service;

import com.example.restapi.entity.*;
import com.example.restapi.exception.NotFoundException;
import com.example.restapi.mapper.userMapper;
import com.example.restapi.model.dto.UserDto;
import com.example.restapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityManager;


import jakarta.persistence.Query;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service("productServiceImpl")
public class productServiceIpl implements productService{

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductImageRepository productImageRepository;

    @Autowired
    CategoriesRepository categoriesRepository;

    @Autowired
    ProductSizeRepository productSizeRepository;

    @Autowired
    OrderDetailsRepository orderDetailsRepository;


    @Override
    public List<product> getAllProducts() {
        List<product> products = productRepository.findAll();
        return products;
    }

    @Override
    public product getProductById(int id) {
      product p=  productRepository.findById(id).orElseThrow(()->new NotFoundException("product not found"));
      return p;
    }

    @Override
    public product addProduct(product product) {
        // Gán ProductSize cho sản phẩm
        for (ProductSize ps : product.getProductSizes()) {
            ps.setProduct(product);  // Gán sản phẩm cho mỗi ProductSize
        }

        // Lưu sản phẩm
        product savedProduct = productRepository.save(product);

        // Lưu ProductSize
        if (savedProduct.getProductSizes() != null) {
            productSizeRepository.saveAll(savedProduct.getProductSizes());
        }

        return savedProduct;
    }


    @Override
    public product updateProduct(int id, product productToUpdate, MultipartFile[] images,
                                 List<Integer> imagesToRemove,List<ProductSize> productSizes) {
        // Kiểm tra xem sản phẩm có tồn tại không
        product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại."));


        if (productToUpdate.getName() != null) {
            existingProduct.setName(productToUpdate.getName());
        }
        if (productToUpdate.getDescription() != null) {
            existingProduct.setDescription(productToUpdate.getDescription());
        }
        if (productToUpdate.getPrice() != 0) {
            existingProduct.setPrice(productToUpdate.getPrice());
        }

        if(productToUpdate.getImage() != null) {
            existingProduct.setImage(productToUpdate.getImage());
        }

        // Cập nhật danh mục nếu có categoryId
        if (productToUpdate.getCategory() != null) {
            Optional<caterogy> categoryOptional = categoriesRepository.findById(productToUpdate.getCategory().getId());
            categoryOptional.ifPresent(existingProduct::setCategory); // Cập nhật danh mục nếu có
        }

// Xử lý hình ảnh cần xóa nếu có
        if (imagesToRemove != null) {
            for (Integer imageId : imagesToRemove) {
                Optional<productimage> imageOptional = productImageRepository.findById(imageId);
                if (imageOptional.isPresent()) {
                    productimage image = imageOptional.get();

                    // Lấy đường dẫn file của hình ảnh từ đối tượng `productimage`
                    String filePath = image.getImageurl(); // Giả sử `getImageurl` trả về đường dẫn file

                    // Xóa file trong thư mục
                    deleteFile("assets/images/" +filePath);

                    // Xóa hình ảnh trong cơ sở dữ liệu
                    productImageRepository.delete(image);
                }
            }
        }

        // Xử lý thêm hình ảnh mới nếu có
        if (images != null && images.length > 0) {
            for (MultipartFile image : images) {
                productimage newImage = new productimage();
                newImage.setImageurl(saveImage(image));  // Giả sử bạn có phương thức lưu ảnh
                newImage.setProduct(existingProduct);  // Liên kết hình ảnh với sản phẩm
                productImageRepository.save(newImage);
            }
        }

        for (ProductSize size : productSizes) {
            ProductSize existingSize = productSizeRepository.findById(size.getId()).orElse(null);
            if (existingSize != null) {
                existingSize.setQuantity(size.getQuantity());
                existingSize.setSize(size.getSize()); // Nếu bạn muốn cập nhật thêm thông tin khác
                productSizeRepository.save(existingSize); // Lưu bản ghi đã sửa vào DB
            }

        }
        // Lưu lại sản phẩm đã cập nhật
        return productRepository.save(existingProduct);
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



    @Override
    public void deleteProduct(int id) {
        Long count = productRepository.countByProductIdInOrderDetails(id);
        if (count > 0) {
            throw new IllegalStateException("Product is part of an order and cannot be deleted.");
        }
        product p = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
        // Xóa hình ảnh chính của sản phẩm nếu tồn tại
        if (p.getImage() != null) {
            deleteFile("assets/images/" + p.getImage());
        }
        if (p.getDetails() != null) {
            for (productimage detail : p.getDetails()) {
                if (detail.getImageurl() != null) {
                    deleteFile("assets/images/" + detail.getImageurl());
                }
            }
        }
        // Xóa sản phẩm khỏi database
        productRepository.delete(p);
    }


    @Override
    public long countProduct() {
        return productRepository.count();
    }

    private void deleteFile(String filePath) {
        File file = new File(filePath);
        if (file.exists()) {
            boolean deleted = file.delete();
            if (!deleted) {
                throw new RuntimeException("Không thể xóa file: " + filePath);
            }
        }
    }


    @Override
    public List<Map<String, Object>> checkProductAvailability(List<Map<String, Object>> orderItems) {
        List<Map<String, Object>> unavailableProducts = new ArrayList<>();

        // Kiểm tra từng sản phẩm trong đơn hàng
        for (Map<String, Object> item : orderItems) {
            Integer productId = ((Number) item.get("productId")).intValue();
            Integer sizeId = ((Number) item.get("sizeId")).intValue();
            int requestedQuantity = ((Number) item.get("quantity")).intValue();

            Optional<product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                product product = productOpt.get();
                Optional<ProductSize> productSizeOpt = product.getProductSizes().stream()
                        .filter(ps -> ps.getSize().getId() == sizeId)
                        .findFirst();

                if (productSizeOpt.isPresent()) {
                    ProductSize productSize = productSizeOpt.get();
                    if (productSize.getQuantity() < requestedQuantity) {
                        // Nếu số lượng yêu cầu lớn hơn số lượng có sẵn
                        Map<String, Object> unavailableProduct = new HashMap<>();
                        unavailableProduct.put("productId", product.getId());
                        unavailableProduct.put("productName", product.getName());
                        unavailableProduct.put("sizeDescription", productSize.getSize().getDescription());
                        unavailableProduct.put("availableQuantity", productSize.getQuantity());
                        unavailableProduct.put("requestedQuantity", requestedQuantity);
                        unavailableProducts.add(unavailableProduct);
                    }
                } else {
                    Map<String, Object> unavailableProduct = new HashMap<>();
                    unavailableProduct.put("productId", product.getId());
                    unavailableProduct.put("productName", product.getName());
                    unavailableProduct.put("sizeDescription", "Size not found");
                    unavailableProduct.put("availableQuantity", 0);
                    unavailableProduct.put("requestedQuantity", requestedQuantity);
                    unavailableProducts.add(unavailableProduct);
                }
            } else {
                Map<String, Object> unavailableProduct = new HashMap<>();
                unavailableProduct.put("productId", productId);
                unavailableProduct.put("productName", "Product not found");
                unavailableProduct.put("sizeDescription", null);
                unavailableProduct.put("availableQuantity", 0);
                unavailableProduct.put("requestedQuantity", requestedQuantity);
                unavailableProducts.add(unavailableProduct);
            }
        }

        return unavailableProducts; // Trả về danh sách sản phẩm không đủ hàng
    }

    @Override
    public Map<String, Object> checkProductQuantity(int id, int sizeId, int quantity) {
        // Tìm kiếm orderDetails theo ID
        OrderDetails orderDetails = orderDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetails not found"));
        ProductSize productSize = orderDetails.getProduct().getProductSizes().stream()
                .filter(ps -> ps.getSize().getId() == sizeId) // Kiểm tra sizeId
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Size not found"));

        int availableQuantity = productSize.getQuantity();
        Map<String, Object> response = new HashMap<>();
        if (quantity > availableQuantity) {
            // Trả về số lượng hiện có và thông báo không đủ
            response.put("isEnough", false);
            response.put("currentQuantity", availableQuantity);
        } else {
            response.put("isEnough", true);
            response.put("currentQuantity", productSize.getQuantity()); // Trả về số lượng mới
        }

        return response;
    }

    @Override
    public List<product> getProductsByCategory(int categoryId) {
        List<product> ds=productRepository.findByCategoryId(categoryId);
        return ds;
    }

}
