package com.example.restapi.repository;

import com.example.restapi.entity.CartDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartDetailsRepository extends JpaRepository<CartDetails, Integer> {
    List<CartDetails> findByCartId(int cartId);
    CartDetails findCartDetailsByCartIdAndProductIdAndSizeId(int cartId,int productId, int sizeId);
    @Modifying
    @Transactional
    @Query("DELETE FROM CartDetails cd WHERE cd.id = :id")
    void deleteByIdCustom(@Param("id") int id);

    @Modifying
    @Transactional
    @Query("DELETE  FROM CartDetails cd WHERE cd.cart.id = :id")
    void deleteByCartId(@Param("id") int id);
}
