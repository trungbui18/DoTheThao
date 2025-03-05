package com.example.restapi.model.dto;

import com.example.restapi.entity.Cart;
import com.example.restapi.entity.Order;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private int id;
    private String username;
    private String email;
    private Date birthday;
    private String sdt;
    private String address;
    private int role;

    private List<Order> listorders;
    private Cart cart;

}
