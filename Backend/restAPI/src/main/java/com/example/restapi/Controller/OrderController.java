package com.example.restapi.Controller;

import com.example.restapi.entity.Order;
import com.example.restapi.entity.user;
import com.example.restapi.repository.UserRepository;
import com.example.restapi.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrder(){
        List<Order> orders = orderService.getAllOrder();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orderbyid/{id}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable int id) {
        // Lấy thông tin đơn hàng với id = orderId
        Order order = orderService.getOrderById(id);

        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/countorders")
    public long countOrders() {
        return orderService.countOrders();
    }

    @GetMapping("/orders/total_price_today")
    public int getTotalPriceBetween(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        System.out.println("ngay bat dau:"+startDate);
        System.out.println("ngay ket thuc:"+endDate);
        return orderService.getTotalPriceBetween(startDate, endDate);
    }

    @DeleteMapping("/deleteorder/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable int orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Đã xóa đơn hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi xóa đơn hàng: " + e.getMessage());
        }
    }

    @PostMapping("/createorder")
    public ResponseEntity<?> createOrder(
            @RequestParam("status") String status,
            @RequestParam("status_Payment") String statusPayment,
            @RequestParam("sdt") String sdt,
            @RequestParam("address") String address,
            @RequestParam("total_price") int totalPrice,
            @RequestParam("name") String name,
            @RequestParam("userId") int userId) {

        try {
            // Tìm User
            user user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Tạo đối tượng Order
            Order order = new Order();
            order.setStatus(status);
            order.setStatus_Payment(statusPayment);
            order.setSdt(sdt);
            order.setAddress(address);
            order.setName(name);
            order.setTotal_price(totalPrice);
            order.setCreate_at(new Date(System.currentTimeMillis()));
            order.setUser(user);

            // Lưu Order vào database
            Order createdOrder = orderService.createOrder(order);

            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }


    @PutMapping("/updatestatus/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable int id, @RequestParam String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/updateorder/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable("id") int id, @RequestBody Order orderDetails) {
        try {
            Order updatedOrder = orderService.updateOrder(id, orderDetails);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/updateTotalPrice/{id}")
    public ResponseEntity<Void> updateTotalPrice(
            @PathVariable("id") int orderId,
            @RequestParam("totalPrice") int totalPrice) {
        try {
            orderService.updateTotalPrice(orderId, totalPrice);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/updatestatuspayment/{id}")
    public ResponseEntity<String> updateStatusPayment(
            @PathVariable("id") int id,
            @RequestParam("status_payment") String statusPayment) {
        try {
            orderService.updateStatusPayment(id, statusPayment);
            return ResponseEntity.ok("Status payment updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status payment: " + e.getMessage());
        }
    }

}
