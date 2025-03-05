package com.example.restapi.Controller;

import com.example.restapi.entity.*;
import com.example.restapi.repository.CartRepository;
import com.example.restapi.repository.ProductRepository;
import com.example.restapi.repository.ProductSizeRepository;
import com.example.restapi.repository.SizeRepository;
import com.example.restapi.service.CartDetailsService;
import com.example.restapi.service.CartDetailsServiceIpl;
import com.example.restapi.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")

public class CartDetailsController {
    @Autowired
    private CartDetailsService cartDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(CartDetailsController.class);
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private CartDetailsServiceIpl cartDetailsServiceIpl;
    @Autowired
    private ProductSizeRepository productSizeRepository;
    @GetMapping("/cartdetails_cartid/{id}")
    public ResponseEntity<List<CartDetails>> getCartDetailsByCartId(@PathVariable("id") int id) {
        List<CartDetails> cartDetailsList = cartDetailsService.getCartDetailsByCartId(id);
        return ResponseEntity.ok(cartDetailsList);
    }

    @PostMapping("/addcartdetails")
    public ResponseEntity<?> addCartDetails(@RequestParam("price") int price,
                                            @RequestParam("quantity") int quantity,
                                            @RequestParam("productId") int productId,
                                            @RequestParam("cartId") int cartId,
                                            @RequestParam("sizeId") int sizeId) {
        Cart cart = cartService.findCartById(cartId);
        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Size size = sizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("Size not found"));
        CartDetails cartDetailsTonTai=cartDetailsServiceIpl.findCartDetailsByCartIdAndProductIdAndSizeId(cart.getId(),product.getId(),size.getId());
        if (cartDetailsTonTai==null) {
            CartDetails newcartDetails=new CartDetails();
            newcartDetails.setPrice(price);
            newcartDetails.setQuantity(quantity);
            newcartDetails.setProduct(product);
            newcartDetails.setSize(size);
            newcartDetails.setCart(cart);
            cartDetailsService.addCartDetails(newcartDetails);
            return ResponseEntity.ok(newcartDetails);
        }
        else {
            int newQuantity = quantity + cartDetailsTonTai.getQuantity();
            cartDetailsTonTai.setQuantity(newQuantity);
            cartDetailsService.updateCartDetails(cartDetailsTonTai);
            return ResponseEntity.ok(cartDetailsTonTai);
        }
    }



    @DeleteMapping("/deletecartdetails/{id}")
    public ResponseEntity<?> deleteCartDetails(@PathVariable("id") int id) {
        cartDetailsService.deleteCartDetailsById(id);
        return ResponseEntity.ok("Đã Xóa Sản Phẩm Khỏi Giỏ Hàng");
    }

    @PutMapping ("/updatecartdetails")
    public ResponseEntity<?> updateCartDetails(    @RequestParam("id") int id,
                                                   @RequestParam("size") int sizeId,
                                                   @RequestParam("quantity") int quantity) {
        try {
            CartDetails cartDetails = cartDetailsService.findCartDetailsById(id);
            if (cartDetails == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy");
            }

            Size size = sizeRepository.findById(sizeId).orElse(null);
            if (size == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy size");
            }

            ProductSize productSize = productSizeRepository.findByProductAndSize(cartDetails.getProduct(), size);
            if (productSize == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy sản phẩm");
            }

            if (quantity < 1 || quantity > productSize.getQuantity()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(productSize.getQuantity());
            }

            cartDetails.setSize(size);
            cartDetails.setQuantity(quantity);
            cartDetailsService.updateCartDetails(cartDetails);
            logger.info("Updated CartDetails with ID: " + id);
            return ResponseEntity.ok(cartDetails);

        } catch (Exception e) {
            logger.error("Error while updating cart item", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating cart item");
        }
    }
    @GetMapping ("/checkCartDetail")
    public ResponseEntity<?> checkCartDetail(@RequestParam("id") int id) {
        Cart cart = cartService.findCartById(id);

        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy giỏ hàng!");
        }
        List<CartDetails> cartDetailsList = cartDetailsService.getCartDetailsByCartId(id);
        if (cartDetailsList == null) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<Map<String,Object>> cartKhongDuSoLuong= new ArrayList<>();
        for (CartDetails cartDetails : cartDetailsList) {
            Size size = cartDetails.getSize();
            ProductSize productSize = productSizeRepository.findByProductAndSize(cartDetails.getProduct(), size);
            if (cartDetails.getQuantity() > productSize.getQuantity()) {
                Map<String, Object> productData = new HashMap<>();
                productData.put("name", cartDetails.getProduct().getName());
                productData.put("soLuongKhachDat", cartDetails.getQuantity());
                productData.put("soLuongTonKho", productSize.getQuantity());
                productData.put("size", size.getDescription());
                cartKhongDuSoLuong.add(productData);
            }
        }
        if (cartKhongDuSoLuong.isEmpty()) {
            return ResponseEntity.ok(cartDetailsList);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cartKhongDuSoLuong);
    }

    @DeleteMapping("/delete_by_cartid/{id}")
    public ResponseEntity<?> deleteByCartId(@PathVariable("id") int id) {
        cartDetailsService.deleteAllCartDetailsByCartId(id);
        return ResponseEntity.ok("xóa thành công");
    }
}



