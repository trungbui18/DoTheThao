package com.example.restapi.service;

import com.example.restapi.entity.Cart;
import com.example.restapi.entity.CartDetails;
import com.example.restapi.repository.CartDetailsRepository;
import com.example.restapi.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartDetailsServiceIpl implements CartDetailsService{

    @Autowired
    private CartDetailsRepository cartDetailsRepository;

    @Autowired
    private CartRepository cartRepository;

    @Override
    public List<CartDetails> getCartDetailsByCartId(int cartId) {
        return cartDetailsRepository.findByCartId(cartId);
    }

    @Override
    public CartDetails addCartDetails(CartDetails cartDetails) {
        return cartDetailsRepository.save(cartDetails);
    }
    @Override
    public void deleteCartDetailsById(int id) {
        cartDetailsRepository.deleteByIdCustom(id);
    }

    @Override
    public void updateCartDetails(CartDetails cartDetails) {
        cartDetailsRepository.save(cartDetails);
    }


    @Override
    public CartDetails findCartDetailsByCartIdAndProductIdAndSizeId(int cartId, int productId, int sizeId) {
        return cartDetailsRepository.findCartDetailsByCartIdAndProductIdAndSizeId(cartId, productId, sizeId);
    }

    @Override
    public CartDetails findCartDetailsById(int id) {
        return cartDetailsRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteAllCartDetailsByCartId(int id) {
        cartDetailsRepository.deleteByCartId(id);
    }

}
