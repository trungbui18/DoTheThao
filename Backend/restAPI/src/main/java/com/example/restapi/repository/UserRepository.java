package com.example.restapi.repository;

import com.example.restapi.entity.user;
import com.example.restapi.model.dto.UserDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<user, Integer> {
    Optional<user> findByUsername(String username);

    @Query(value = "SELECT COUNT(*) FROM orders WHERE user_id = :userId", nativeQuery = true)
    Long countByuserIdInOrder(@Param("userId") int userId);

    @Query(value = "SELECT u.id FROM user u INNER JOIN orders o ON u.id = o.user_id WHERE o.id = :orderId", nativeQuery = true)
    Integer findUserIdByOrderId(@Param("orderId") int orderId);
}
