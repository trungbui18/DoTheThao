package com.example.restapi.service;

import com.example.restapi.entity.product;
import com.example.restapi.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendServiceIpl implements RecommendService{
    @Autowired
    ProductRepository productRepository;

    @Override
    public List<product> getListRecommendProduct(List<Integer> listIdProduct) {
        return productRepository.findProductsByIds(listIdProduct);
    }
}
