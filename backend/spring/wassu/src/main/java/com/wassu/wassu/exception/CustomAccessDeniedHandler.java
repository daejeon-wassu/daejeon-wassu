package com.wassu.wassu.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ae) throws IOException {
        log.error("Access denied for URL: " + request.getRequestURI(), ae);
        log.error("Access denied reason: " + ae.getMessage());
        String errorMessage = "Access denied for URL: " + ae.getMessage();

        response.sendError(HttpServletResponse.SC_FORBIDDEN, ae.getMessage());
    }
}
