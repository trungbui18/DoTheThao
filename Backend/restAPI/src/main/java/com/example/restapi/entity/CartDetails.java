package com.example.restapi.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="cart_details")
public class CartDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int price;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private product product;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonManagedReference
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "id_size", nullable = false)
    private Size size;
}
