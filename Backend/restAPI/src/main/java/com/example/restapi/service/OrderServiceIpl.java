package com.example.restapi.service;

import com.example.restapi.entity.Order;
import com.example.restapi.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceIpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(int orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    @Override
    @Transactional
    public void deleteOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        orderRepository.deleteOrderById(orderId);
    }

    @Override
    public int getTotalPriceToday() {
        // Lấy ngày hiện tại
        return 0;
//        LocalDate today = LocalDate.now();
//        Date currentDate = Date.valueOf(today);

        // Truy vấn tổng số tiền của các đơn hàng trong ngày
//        return orderRepository.findTotalPriceByCreateAt(currentDate).orElse(0);
    }

    @Override
    public long countOrders() {
        return orderRepository.count();
    }

    @Override
    public Order createOrder(Order order) {
        // Xử lý logic bổ sung nếu cần
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(int id, String status) {
        // Tìm đơn hàng dựa trên ID
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Cập nhật trạng thái
        order.setStatus(status);

        // Lưu lại thay đổi vào database
        return orderRepository.save(order);
    }

    @Override
    public void updateTotalPrice(int orderId, int totalPrice)  {
        // Lấy thông tin đơn hàng theo ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Cập nhật tổng tiền của đơn hàng
        order.setTotal_price(totalPrice);

        // Lưu thông tin đơn hàng mới vào cơ sở dữ liệu
        orderRepository.save(order);
    }

    @Override
    public Order updateOrder(int id, Order order)  {

            Order existingOrder = orderRepository.findById(id).orElse(null);

            if (order.getStatus() != null) {
                existingOrder.setStatus(order.getStatus());
            }
            if (order.getStatus_Payment() != null) {
                existingOrder.setStatus_Payment(order.getStatus_Payment());
            }
            if (order.getSdt() != null) {
                existingOrder.setSdt(order.getSdt());
            }
            if (order.getAddress() != null) {
                existingOrder.setAddress(order.getAddress());
            }
            if (order.getTotal_price() != 0) {
                existingOrder.setTotal_price(order.getTotal_price());
            }
            if (order.getCreate_at() != null) {
                existingOrder.setCreate_at(order.getCreate_at());
            }
            return orderRepository.save(existingOrder);

    }

    @Override
    public void updateStatusPayment(int id, String statusPayment) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();

            // Cập nhật status_payment
            existingOrder.setStatus_Payment(statusPayment);

            // Lưu thay đổi vào DB
            orderRepository.save(existingOrder);
        } else {
            throw new Exception("Order not found with id: " + id);
        }
    }
    public int getTotalPriceBetween(LocalDate startDate, LocalDate endDate) {
        return orderRepository.findTotalPriceBetween(startDate, endDate)
                .orElse(0);
    }

}
