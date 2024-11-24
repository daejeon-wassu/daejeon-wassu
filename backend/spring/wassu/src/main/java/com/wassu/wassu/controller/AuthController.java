package com.wassu.wassu.controller;

import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.auth.AuthService;
import com.wassu.wassu.service.user.UserService;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.dto.user.UserAuthDTO;
import com.wassu.wassu.dto.user.UserSignupDTO;
import com.wassu.wassu.util.UtilTool;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wassu/auth")
@AllArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UtilTool utilTool;

//    @Autowired
//    public AuthController(UserService userService, AuthService authService, JwtUtil jwtUtil, UtilTool utilTool) {
//        this.userService = userService;
//        this.authService = authService;
//        this.jwtUtil = jwtUtil;
//        this.utilTool = utilTool;
//    }

    private final Map<String, Boolean> verificationEmails = new HashMap<>();
    
    // 회원가입
    @SecurityRequirement(name = "")
    @PostMapping("/signup")
    public ResponseEntity<?> joinUser(@RequestBody UserSignupDTO userSignupDTO) {
        try {
            String email = userSignupDTO.getEmail();
            if (!verificationEmails.getOrDefault(email, false)) {
                logger.error("Email not verified");
                return ResponseEntity.status(404).body(utilTool.createResponse("status", "Email not verified"));
            }
            UserEntity userEntity = authService.convertToUserEntity(userSignupDTO);
            userService.createUser(userEntity);
            logger.info("Recieved signup request: {}", userSignupDTO.getEmail());
            return ResponseEntity.ok(utilTool.createResponse("status", "success"));
        } catch (IllegalStateException e) {
            logger.error("Failed to signup (email already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(utilTool.createResponse("status", "email already exist"));
        } catch (Exception e) {
            logger.error("Failed to signup : {}", e.getMessage());
            return ResponseEntity.status(500).body(utilTool.createResponse("status", "failed"));
        }
    }
    
    //로그인
    @SecurityRequirement(name = "")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserAuthDTO userAuthDTO) {
        // 로그인 처리
        try {
            Map<String, String> tokens = authService.authenticateAndGenerateTokens(userAuthDTO.getEmail(), userAuthDTO.getPassword());
            if (tokens == null) {
                log.error("Failed to authenticate user: {}", userAuthDTO.getEmail());
                return ResponseEntity.status(404).body(utilTool.createResponse("status", "Invalid email or password"));
            }
            return ResponseEntity.ok(tokens);
        } catch (IllegalStateException e) {
            logger.error("Failed to login (email already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(utilTool.createResponse("status", "failed"));
        }
    }
    
    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization") String refreshToken) {
        try{
            String token  = refreshToken.replace("Bearer ", "");
            authService.logout(token);
            return ResponseEntity.ok(utilTool.createResponse("status", "success"));
        } catch (IllegalStateException e) {
            logger.error("Failed to logout (refresh token already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // 리프레쉬 토큰 갱신
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader(value = "Authorization") String refreshToken){
        try {
            String token = refreshToken.replace("Bearer ", "");
            if (jwtUtil.validateToken(token)) {
                String userEmail = jwtUtil.extractUserEmail(token);
                String newAccessToken = jwtUtil.generateToken(userEmail, "access");
                return ResponseEntity.ok(utilTool.createResponse("access", newAccessToken));
            }
        } catch (Exception e) {
            log.error("Failed to refresh access token: {}", e.getMessage());
            authService.logout(refreshToken);
            return ResponseEntity.status(401).body(utilTool.createResponse("status", "logout"));
        }
        authService.logout(refreshToken);
        log.warn("Refresh token not validated: {}", refreshToken);
        return ResponseEntity.status(404).body(utilTool.createResponse("status", "logout"));
    }

    // 회원탈퇴
    @DeleteMapping("/delete-account")
    private ResponseEntity<?> deleteAccount(@RequestHeader(value = "Authorization") String accessToken) {
        try {
            String token = accessToken.replace("Bearer ", "");
            if (jwtUtil.validateToken(token)) {
                authService.deleteAccount(token);
                return ResponseEntity.ok(utilTool.createResponse("status", "success"));
            }
            return ResponseEntity.status(401).body(utilTool.createResponse("status","Invalid access token"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(utilTool.createResponse("status", "failed"));
        }
    }

//    // 인증 이메일 발송
//    @PostMapping("/send-verfication-email")
//    private ResponseEntity<?> sendVerificationEmail(@RequestParam String email) {
//        log.info("Sending verification email: {}", email);
//        authService.sendVerificationEmail(email);
//        return ResponseEntity.ok(utilTool.createResponse("status", "success"));
//    }
//
//    // 이메일 인증
//    @GetMapping("/verify-email/{userEmail}")
//    private ResponseEntity<?> verifyEmail(@PathVariable String userEmail) {
//
//    }
    
    // 메일 전송
    @PostMapping("/send-verification-code")
    private ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
        String response = authService.sendVerificationCode(email);
        return ResponseEntity.ok(utilTool.createResponse("status", "success"));
    }


    // 코드 검증
    @PostMapping("/verify-code")
    private ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        Boolean isVerified = authService.verifyCode(email, code);
        if (isVerified) {
            verificationEmails.put(email, true);
            authService.removeVerificationCode(email);
            return ResponseEntity.ok(utilTool.createResponse("status", "success"));
        }
        return ResponseEntity.status(401).body(utilTool.createResponse("status", "Invalid verification code"));
    }
    

    

}
