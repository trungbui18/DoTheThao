package com.example.restapi.service;

import com.example.restapi.entity.Cart;
import com.example.restapi.entity.user;
import com.example.restapi.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CartServiceIpl implements CartService{
    @Autowired
    private CartRepository cartRepository;

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll(); // Trả về tất cả các Cart từ cơ sở dữ liệu
    }

    @Override
    public Cart getCartDetails(int id) {
        return cartRepository.findById(id).orElse(null); // Trả về Cart nếu tồn tại, nếu không trả về null
    }

    @Override
    public Cart addCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public Cart findCartById(int id) {
        Cart cart=cartRepository.findById(id).orElse(null);
        return cart;
    }


}
