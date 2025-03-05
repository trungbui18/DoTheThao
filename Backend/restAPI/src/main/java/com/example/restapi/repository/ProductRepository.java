package com.example.restapi.repository;

import com.example.restapi.entity.product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<product,Integer> {
        @Query(value = "SELECT COUNT(*) FROM order_details WHERE product_id = :productId", nativeQuery = true)
        Long countByProductIdInOrderDetails(@Param("productId") int productId);

        List<product> findByCategoryId(int categoryId);

    @Query("SELECT p FROM product p WHERE p.id IN :ids")
    List<product> findProductsByIds(@Param("ids") List<Integer> ids);
    }
