package com.example.restapi.service;

import com.example.restapi.entity.*;
import com.example.restapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderDetailsServiceIpl implements OrderDetailsService {
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Override
    public List<OrderDetails> getOrderDetailsByOrderId(int orderId) {
        return orderDetailsRepository.findByOrderId(orderId);
    }
    public OrderDetails addOrderDetails(OrderDetails orderDetails) {
        // Lưu OrderDetails vào cơ sở dữ liệu
        return orderDetailsRepository.save(orderDetails);
    }


    @Override
    public void deleteOrderDetails(int id) {
        System.out.print(id);
        OrderDetails orderDetails = orderDetailsRepository.findById(id).orElseThrow(()->new RuntimeException("Order Details Not Found"));
        List<ProductSize> productSize=orderDetails.getProduct().getProductSizes();
        for(ProductSize productSize1:productSize){
            if(productSize1.getSize().getId()==orderDetails.getSize().getId()){
                productSize1.setQuantity(productSize1.getQuantity()+orderDetails.getQuantity());
                productSizeRepository.save(productSize1);
            }
        }
        orderDetailsRepository.deleteByIdCustom(id);
    }
    public OrderDetails getOrderDetailsById(int id) {
        return orderDetailsRepository.findById(id).orElse(null);
    }

    public OrderDetails updateOrderDetails(OrderDetails orderDetails,int quantityDelta,boolean newSize) {
        if(newSize){
            List<ProductSize> productSize=orderDetails.getProduct().getProductSizes();
            for(ProductSize productSize1:productSize){
                if(productSize1.getSize().getId()==orderDetails.getSize().getId()){
                    productSize1.setQuantity(productSize1.getQuantity()-orderDetails.getQuantity());
                    productSizeRepository.save(productSize1);
                }
            }
        }else{
            List<ProductSize> productSize=orderDetails.getProduct().getProductSizes();
            for(ProductSize productSize1:productSize){
                if(productSize1.getSize().getId()==orderDetails.getSize().getId()){
                    productSize1.setQuantity(productSize1.getQuantity()+quantityDelta);
                    productSizeRepository.save(productSize1);
                }
            }
        }

        return orderDetailsRepository.save(orderDetails);
    }


}
