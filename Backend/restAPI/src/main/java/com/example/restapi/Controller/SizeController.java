package com.example.restapi.Controller;

import com.example.restapi.entity.Size;
import com.example.restapi.service.SizeServiceIpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SizeController {
    @Autowired
    private SizeServiceIpl sizeService;

    // API để lấy tất cả các size
    @GetMapping("/sizes")
    public ResponseEntity<List<Size>> getAllSizes() {
        List<Size> sizes = sizeService.getAllSizes();
        return ResponseEntity.ok(sizes);
    }
}
