package com.example.restapi.VNPAY;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class ResponseVNPAY implements Serializable {
    private String status;
    private String message;
    private String URL;
}
