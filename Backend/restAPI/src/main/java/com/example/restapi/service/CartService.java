package com.example.restapi.service;

import com.example.restapi.entity.Cart;

import java.util.List;

public interface CartService {
    List<Cart> getAllCarts();
    Cart getCartDetails(int id);
    Cart addCart(Cart cart);
    Cart findCartById(int id);
}
