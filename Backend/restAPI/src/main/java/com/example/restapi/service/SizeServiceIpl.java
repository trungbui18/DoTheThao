package com.example.restapi.service;

import com.example.restapi.entity.Size;
import com.example.restapi.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeServiceIpl {
    @Autowired
    private SizeRepository sizeRepository;

    // Tìm Size theo ID
    public Size findById(int sizeId) {
        return sizeRepository.findById(sizeId).orElse(null);
    }
    // Lấy tất cả các size
    public List<Size> getAllSizes() {
        return sizeRepository.findAll();
    }
}
