package com.example.restapi.service;

import com.example.restapi.entity.caterogy;
import org.springframework.stereotype.Service;

import java.util.List;

public interface categoriesService {
    public List<caterogy> getAllCategories();
    public void deleteCategory(int id);
    public caterogy addCategory(caterogy category);
    public caterogy updateCategory(int id, caterogy updatedCategory);

}
