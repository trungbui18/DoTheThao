package com.example.restapi.service;

import com.example.restapi.entity.product;

import java.util.List;

public interface RecommendService {
    public List<product> getListRecommendProduct(List<Integer> listIdProduct);
}

