package com.example.restapi.Controller;

import com.example.restapi.entity.Cart;
import com.example.restapi.repository.UserRepository;
import com.example.restapi.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.restapi.entity.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private com.example.restapi.service.userService userService;

    @GetMapping("/carts")
    public ResponseEntity<List<Cart>> getAllCarts() {
        List<Cart> cartList = cartService.getAllCarts();

        if (cartList.isEmpty()) {
            return ResponseEntity.notFound().build(); // Nếu không có Cart
        }

        return ResponseEntity.ok(cartList); // Trả về danh sách Cart
    }

    @GetMapping("/cartbyid/{id}")
    public ResponseEntity<Cart> getCartDetails(@PathVariable int id) {
        Cart cart = cartService.getCartDetails(id);

        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cart);
    }
    @PostMapping("/createcart")
    public ResponseEntity<?> createCart(@RequestParam("userId") int userId) {

        try {
            Optional<user> u = userRepository.findById(userId);
            if (u.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            user u1 = u.get();
            Cart cart = new Cart();
            cart.setUser(u1);

            // Lưu giỏ hàng vào database
            Cart savedCart = cartService.addCart(cart);

            // Trả về ID của giỏ hàng mới tạo
            Map<String, Object> response = new HashMap<>();
            response.put("cartId", savedCart.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo giỏ hàng: " + e.getMessage());
        }
    }


}
