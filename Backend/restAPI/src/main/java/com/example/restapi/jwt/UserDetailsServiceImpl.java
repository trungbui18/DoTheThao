package com.example.restapi.jwt;

import com.example.restapi.entity.user;
import com.example.restapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
//        user user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//        String role = (user.getRole() == 1) ? "ROLE_ADMIN" : "ROLE_USER";
//
//        // Tạo đối tượng UserDetails với thông tin người dùng và gán role
//        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
//                .password(user.getPassword())
//                .build();
//    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        user user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Xác định role dựa trên giá trị của user.getRole() (role có thể là 1 cho ADMIN, 0 cho USER)
        String role = (user.getRole() == 1) ? "ROLE_ADMIN" : "ROLE_USER";

        // Tạo đối tượng UserDetails với thông tin người dùng và gán role
        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(role) // Gán role vào authorities
                .build();
    }

}
