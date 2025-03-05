package com.example.restapi.jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    public String login(String username, String password) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(username, password);

            // Xác thực người dùng
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            if (authentication == null) {
                throw new AuthenticationException("Authentication failed: Invalid username or password") {};
            }
            // Tạo token JWT
            String jwtToken = jwtUtil.generateToken(authentication.getName());
            return jwtToken; // Trả về token cho client
        } catch (AuthenticationException e) {
            // Xử lý lỗi xác thực
            return "Authentication failed: " + e.getMessage();
        }
    }
}
