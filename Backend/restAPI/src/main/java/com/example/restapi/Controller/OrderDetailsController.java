package com.example.restapi.Controller;

import com.example.restapi.entity.*;
import com.example.restapi.repository.*;
import com.example.restapi.service.OrderDetailsService;
import com.example.restapi.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class OrderDetailsController {
    @Autowired
    private OrderDetailsService orderDetailsService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ProductSizeRepository productSizeRepository;

    @GetMapping("/orderdetails_orderid/{id}")
    public ResponseEntity<List<OrderDetails>> getOrderDetailsByOrderId(@PathVariable int id) {
        List<OrderDetails> orderDetailsList = orderDetailsService.getOrderDetailsByOrderId(id);
        return ResponseEntity.ok(orderDetailsList);
    }

    @PostMapping("/addorderdetails")
    public ResponseEntity<OrderDetails> addOrderDetails(@RequestParam("price") int price,
                                                        @RequestParam("quantity") int quantity,
                                                        @RequestParam("productId") int productId,
                                                        @RequestParam("orderId") int orderId,
                                                        @RequestParam("sizeId") int sizeId) {
        product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Lấy thông tin size
        Size size = sizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("Size not found"));

        // Kiểm tra số lượng sản phẩm trong kho
        Optional<ProductSize> productSizeOpt = product.getProductSizes().stream()
                .filter(ps -> ps.getSize().getId() == sizeId)
                .findFirst();

        if (productSizeOpt.isPresent()) {
            ProductSize productSize = productSizeOpt.get();

            // Kiểm tra xem số lượng còn đủ hay không
            if (productSize.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient product quantity in stock");
            }

            // Trừ số lượng sản phẩm
            productSize.setQuantity(productSize.getQuantity() - quantity);
            productRepository.save(product);
        } else {
            throw new RuntimeException("Size not found for product");
        }

        // Tạo mới OrderDetails
        OrderDetails orderDetails = new OrderDetails();
        orderDetails.setPrice(price);
        orderDetails.setQuantity(quantity);
        orderDetails.setProduct(product);
        orderDetails.setOrder(order);
        orderDetails.setSize(size);

        // Lưu OrderDetails
        OrderDetails createdOrderDetails = orderDetailsService.addOrderDetails(orderDetails);

        return ResponseEntity.ok(createdOrderDetails);
    }



    // API xóa OrderDetails theo ID
    @DeleteMapping("/deleteorderdetails/{id}")
    public ResponseEntity<?> deleteOrderDetails(@PathVariable int id) {
            orderDetailsService.deleteOrderDetails(id);
            return ResponseEntity.ok("Xóa OrderDetails thành công.");

    }

    @PutMapping("/updateorderdetails/{id}")
    public ResponseEntity<OrderDetails> updateOrderDetails(
            @PathVariable("id") int id,
            @RequestParam("price") int price,
            @RequestParam("quantity") int quantity,
            @RequestParam("productId") int productId,
            @RequestParam("orderId") int orderId,
            @RequestParam("sizeId") int sizeId,
            @RequestParam("quantityDelta") int quantityDelta) {
        System.out.print("size id:"+sizeId);
        System.out.print("delta:"+quantityDelta);
        boolean newSize=true;
        OrderDetails existingOrderDetails = orderDetailsService.getOrderDetailsById(id);
        System.out.print("size cũ::"+existingOrderDetails.getSize().getId());
        if (existingOrderDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        existingOrderDetails.setPrice(price);
        existingOrderDetails.setQuantity(quantity);

        // Lấy đối tượng product, order, và size từ DB
        product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Size size = sizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("Size not found"));

        existingOrderDetails.setProduct(product);
        existingOrderDetails.setOrder(order);
        if(size.getId()==existingOrderDetails.getSize().getId()){
            newSize=false;
        }else{
            List<ProductSize> productSize=existingOrderDetails.getProduct().getProductSizes();
            for(ProductSize productSize1:productSize){
                if(productSize1.getSize().getId()==existingOrderDetails.getSize().getId()){
                    productSize1.setQuantity(productSize1.getQuantity()+quantityDelta+quantity);
                    productSizeRepository.save(productSize1);
                }
            }
        }
        existingOrderDetails.setSize(size);

        OrderDetails updatedOrderDetails = orderDetailsService.updateOrderDetails(existingOrderDetails,quantityDelta,newSize);

        return ResponseEntity.ok(updatedOrderDetails);
    }
    @GetMapping("/orderdetails_orderidKT/{id}")
    public ResponseEntity<List<OrderDetails>> getOrderDetailsByOrderIdKT(@PathVariable int id, @RequestParam int idUser) {
        List<OrderDetails> orderDetailsList = orderDetailsService.getOrderDetailsByOrderId(id);
        Order order=orderService.getOrderById(id);
        if (order == null||order.getUser().getId() != idUser) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(orderDetailsList);
    }
}
