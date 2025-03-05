package com.example.restapi.service;

import com.example.restapi.entity.Order;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    public List<Order> getAllOrder();
    public Order getOrderById(int orderId);
    public  Order createOrder(Order order);
    public Order updateOrderStatus(int id, String status);
    public void updateTotalPrice(int orderId, int totalPrice);
    public Order updateOrder(int id, Order orderDetails);
    public void updateStatusPayment(int id, String statusPayment) throws Exception;
    public void deleteOrder(int orderId);
    public int getTotalPriceToday();
    public long countOrders();
    public int getTotalPriceBetween(LocalDate startDate, LocalDate endDate);
}
