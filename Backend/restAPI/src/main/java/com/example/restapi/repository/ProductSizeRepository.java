package com.example.restapi.repository;

import com.example.restapi.entity.ProductSize;
import com.example.restapi.entity.Size;
import com.example.restapi.entity.product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSizeRepository extends JpaRepository<ProductSize, Integer> {
    ProductSize findByProductAndSize(product product, Size size);

}
