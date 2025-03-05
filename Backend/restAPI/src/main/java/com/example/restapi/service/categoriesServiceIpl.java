package com.example.restapi.service;

import com.example.restapi.entity.caterogy;
import com.example.restapi.exception.NotFoundException;
import com.example.restapi.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("categoriesServiceImpl")
public class categoriesServiceIpl implements categoriesService {

    @Autowired
    CategoriesRepository categoriesRepository;


    @Override
    public List<caterogy> getAllCategories() {
        return categoriesRepository.findAll();
    }


    public caterogy addCategory(caterogy category) {
        return categoriesRepository.save(category);
    }
    // Xóa category theo id
    public void deleteCategory(int id) {
        caterogy category = categoriesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));

        // Kiểm tra nếu category chứa products
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new IllegalStateException("Cannot delete category as it contains products.");
        }

        categoriesRepository.delete(category);
    }

    // Service
    public caterogy updateCategory(int id, caterogy updatedCategory) {
        caterogy existingCategory = categoriesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));

        existingCategory.setName(updatedCategory.getName());

        return categoriesRepository.save(existingCategory);
    }

}
