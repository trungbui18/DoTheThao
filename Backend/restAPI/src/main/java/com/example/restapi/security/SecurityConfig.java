package com.example.restapi.security;

import com.example.restapi.jwt.JwtAuthenticationFilte;
import com.example.restapi.jwt.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetails;

    @Autowired
    private JwtAuthenticationFilte jwtAuthenticationFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Thiết lập CORS
                .csrf(csrf -> csrf.disable()) // Tắt CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login/login", "/api/create","/api/user/name/**","/api/user/{id}"
                                ,"/api/payment/create_payment"
                                ,"/api/recommend"
                                ,"/api/updatecategories/{id}","/api/addcategories","/api/deletecategories/{id}"
                                ,"/api/createorder","/api/orders","/api/deleteorder/{orderId}","/api/countorders"
                                ,"/api/orderbyid/{id}","/api/userbyorderid/{id}"
                                ,"/api/updatestatus/{id}/status","/api/updateTotalPrice/{id}"
                                ,"/api/updateorder/{id}","/api/updatestatuspayment/{id}"
                                ,"/api/categories","/api/update/{id}"
                                ,"/api/orderdetails_orderid/{id}","/api/addorderdetails","/api/deleteorderdetails/{id}","/api/orderdetails_orderidKT/{id}"
                                ,"/api/updateorderdetails/{id}","/api/{id}/check_quantity","/api/orders/total_price_today"
                                ,"/api/carts", "/api/cartbyid/{id}"
                                ,"/api/cartdetails_cartid/{id}","/api/addcartdetails","/api/deletecartdetails/{id}"
                                ,"/api/updatecartdetails/{id}","/api/delete_by_cartid/{id}"
                                ,"/api/sizes","/api/updateproduct/{id}","/api/users","/api/products/{id}","/api/category/{categoryId}"
                                ,"/api/createcart","/api/updatecartdetails","/api/checkCartDetail"
                                ,"/api/check_availability"
                                ,"/api/products").permitAll() // Cho phép truy cập mà không cần xác thực
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/users/delete/{id}"
                                ,"/api/deleteproduct/{id}","/api/addproduct"
                                ,"/api/countuser","/api/countproduct"
                                ).hasRole("ADMIN")
                        .requestMatchers("/api/**").authenticated() // Các yêu cầu khác phải được xác thực
                        .anyRequest().authenticated() // Các yêu cầu khác yêu cầu xác thực
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Thêm filter JWT
//                .formLogin(form -> form.permitAll())
                .logout(logout -> logout.permitAll()); // Cho phép logout

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:3000"); // Địa chỉ frontend
        configuration.addAllowedHeader("*"); // Cho phép tất cả các header
        configuration.addAllowedMethod("*"); // Cho phép tất cả các phương thức (GET, POST, PUT, DELETE, ...)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetails).passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
