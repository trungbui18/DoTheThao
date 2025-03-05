package com.example.restapi.service;

import com.example.restapi.entity.OrderDetails;

import java.util.List;

public interface OrderDetailsService {
    List<OrderDetails> getOrderDetailsByOrderId(int orderId);

    OrderDetails addOrderDetails(OrderDetails orderDetails);

    void deleteOrderDetails(int id);

    public OrderDetails updateOrderDetails(OrderDetails orderDetails,int quantityDelta,boolean newSize);

    public OrderDetails getOrderDetailsById(int id);

}
