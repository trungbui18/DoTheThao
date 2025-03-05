package com.example.restapi.Controller;


import com.example.restapi.entity.caterogy;
import com.example.restapi.service.categoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CategoryController {
    @Qualifier("categoriesServiceImpl")
    @Autowired
    categoriesService categoriesService;

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategory() {
        List<caterogy> ds=categoriesService.getAllCategories();
        return ResponseEntity.ok(ds);
    }
    @PostMapping("/addcategories")
    public ResponseEntity<caterogy> addCategory(@RequestBody caterogy category) {
        caterogy createdCategory = categoriesService.addCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    // Xóa category theo id
    @DeleteMapping("/deletecategories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable int id) {
        try {
            categoriesService.deleteCategory(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalStateException e) {
            // Trả về thông báo lỗi với mã 400 (BAD_REQUEST)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }


    // Controller
    @PutMapping("/updatecategories/{id}")
    public ResponseEntity<caterogy> updateCategory(@PathVariable int id, @RequestBody caterogy updatedCategory) {
        caterogy category = categoriesService.updateCategory(id, updatedCategory);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }


}
