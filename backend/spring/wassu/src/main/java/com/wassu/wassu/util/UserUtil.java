package com.wassu.wassu.util;

import com.wassu.wassu.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserUtil {
    private final JwtUtil jwtUtil;

    public UserUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public String extractUserEmail(String accessToken) {
        if (accessToken != null && !accessToken.isEmpty()) {
            log.info(accessToken);
            String token = accessToken.replace("Bearer ", "");
            return jwtUtil.extractUserEmail(token);
        } else {
            return null;
        }
    }
}
