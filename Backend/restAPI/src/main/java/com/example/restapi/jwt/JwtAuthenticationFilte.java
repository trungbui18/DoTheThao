package com.example.restapi.jwt;

import com.example.restapi.entity.user;
import com.example.restapi.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilte extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getJwtFromRequest(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.extractUsername(token);

            // Truy vấn thông tin người dùng từ cơ sở dữ liệu
            Optional<user> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                user user = userOpt.get();

                // Tạo đối tượng Authentication với quyền (role) lấy từ cơ sở dữ liệu
                List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority(user.getRole() == 1 ? "ROLE_ADMIN" : "ROLE_USER"));

                Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

