package com.example.restapi.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
@Entity
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Tạo tự động khóa chính
    private int id;
    private String username;
    private String password;
    private String email;
    private Date birthday;
    private String sdt;
    private String address;
    private int role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true , fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Order> listorders;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Cart cart;

}
