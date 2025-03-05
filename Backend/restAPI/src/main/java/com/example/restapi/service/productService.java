package com.example.restapi.service;

import com.example.restapi.entity.ProductSize;
import com.example.restapi.entity.product;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface productService {
    public List<product> getAllProducts();
    public product getProductById(int id);
    public product addProduct(product product);
    public product updateProduct(int id, product product, MultipartFile[] images, List<Integer> imagesToRemove, List<ProductSize>productSizes);
    public void deleteProduct(int id);
    public long countProduct();
    public List<Map<String, Object>> checkProductAvailability(List<Map<String, Object>> orderItems);
    public Map<String, Object> checkProductQuantity(int id,int sizeId, int quantity);

    List<product> getProductsByCategory(int categoryId);
}
