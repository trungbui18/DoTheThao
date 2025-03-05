package com.example.restapi.repository;

import com.example.restapi.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Order o WHERE o.id = :orderId")
    void deleteOrderById(int orderId);

//    @Query("SELECT SUM(o.total_price) FROM Order o WHERE o.create_at = :createAt")
//    Optional<Integer> findTotalPriceByCreateAt(@Param("createAt") Date createAt);

    @Query("SELECT SUM(o.total_price) FROM Order o WHERE o.create_at >= :startDate AND o.create_at <= :endDate")
    Optional<Integer> findTotalPriceBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


}
