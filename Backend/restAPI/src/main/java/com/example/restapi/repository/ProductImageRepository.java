package com.example.restapi.repository;

import com.example.restapi.entity.productimage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<productimage,Integer> {
}
