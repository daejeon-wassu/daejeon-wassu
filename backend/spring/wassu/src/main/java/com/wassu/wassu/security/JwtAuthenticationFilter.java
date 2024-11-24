package com.wassu.wassu.security;

import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Security;
import java.util.List;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/wassu/auth/signup",
            "/wassu/auth/login",
            "/wassu/posts/search",
            "/wassu/posts/filter",
            "/wassu/posts/read/**",
            "/wassu/tourist/search",
            "/wassu/tourist/filter/**",
            "/wassu/tourist/details/**",
            "/wassu/tourist/recommend",
            "/wassu/marble/**",
            "/wassu/marble",
            "/wassu/posts/read/**",
            "/swagger/**"
    );

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        String requestMethod = request.getMethod();

        if (EXCLUDED_PATHS.contains(requestURI)) {
            chain.doFilter(request, response);
            log.info("Passed URI: " + requestURI + "--- Request Method: " + requestMethod + "------------------------------" );
            return;
        }

        System.out.println("Token Request------------------------------");
        try {
            log.info("Request: " + request);
            String token = extractToken(request);
            log.info("Token: " + token);
            if (token != null && jwtUtil.validateToken(token)) {
                log.info("Token Validated");
                String userEmail = jwtUtil.extractUserEmail(token);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userEmail, null, null);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                chain.doFilter(request, response);
                log.info("User Authenticated by JWT Token");
            } else if (token != null && jwtUtil.isTokenExpired(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"status\":\"expired\"}");
            } else {
                log.info("Token Invalid");
                chain.doFilter(request, response);
            }
        } catch (Exception e) {
            log.error("Exception in JwtAuthenticationFilter: ", e);
        }
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")){
            return authHeader.substring(7);
        }
        return null;
    }
}