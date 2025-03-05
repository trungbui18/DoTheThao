package com.example.restapi.Controller;

import com.example.restapi.entity.product;
import com.example.restapi.service.RecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;



@RestController
@RequestMapping("/api")
public class RecommendationController {
    @Autowired
    RecommendService recommendService;

    @GetMapping("/recommend")
    public List<product> recommend(@RequestParam int id) {
        String apiAiRecommend = "http://localhost:5000/recommend?id=" + id;
        RestTemplate restTemplate = new RestTemplate();
        List<Integer> recommendations = restTemplate.getForObject(apiAiRecommend, List.class);
        for(int i: recommendations) {
            System.out.println(i);
        }
        List<product> listRecommend=recommendService.getListRecommendProduct(recommendations);
        return listRecommend;
    }

}
