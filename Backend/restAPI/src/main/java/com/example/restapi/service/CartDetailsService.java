package com.example.restapi.service;

import com.example.restapi.entity.CartDetails;

import java.util.List;

public interface CartDetailsService {
    List<CartDetails> getCartDetailsByCartId(int cartId);
    CartDetails addCartDetails(CartDetails cartDetails);
    void deleteCartDetailsById(int id);
    void updateCartDetails(CartDetails cartDetails);
    CartDetails findCartDetailsByCartIdAndProductIdAndSizeId(int cartId,int productId, int sizeId);
    CartDetails findCartDetailsById(int id);
    void deleteAllCartDetailsByCartId(int id);
}


