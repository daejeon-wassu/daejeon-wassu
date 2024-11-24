package com.wassu.wassu.service.auth;

import com.wassu.wassu.dto.user.UserSignupDTO;
import com.wassu.wassu.entity.BlackListEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.BlackListRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.email.EmailService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.text.MessageFormat;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final PasswordEncoder passwordEncoder;
    private final BlackListRepository blackListRepository;

//    @Value("${server.domain}")
//    private String serverDomain;

    @Autowired
    private EmailService emailService;
    
    // 토큰 인증 및 생성
    public Map<String, String> authenticateAndGenerateTokens(String email, String password) {
        // 사용자 조회
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        // 사용자 인증 : 이메일, 비밀번호 일치 확인
        try {
            if (userEntityOptional.isPresent()) {
                UserEntity userEntity = userEntityOptional.get();
                if (passwordEncoder.matches(password, userEntity.getPassword())) {
                    Map<String, String> tokens = new HashMap<>();
                    tokens.put("access", jwtUtil.generateToken(email, "access"));
                    tokens.put("refresh", jwtUtil.generateToken(email, "refresh"));
                    return tokens;
                }
            } else {
                logger.error("User not found");
                return null;
            }
        } catch (Exception e) {
            logger.error("Exception in AuthService: {}", e.getMessage());
            return null;
        }
        return null;
    }
    
    // 계정 탈퇴
    public void deleteAccount(String token) {
        String email  = jwtUtil.extractUserEmail(token);
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        try {
            if (userEntityOptional.isPresent()) {
                UserEntity userEntity = userEntityOptional.get();
                userRepository.delete(userEntity);
                logger.info("User {} deleted", email);
            } else {
                logger.error("User not found");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
            }
        } catch (Exception e) {
            logger.error("Exception in Delete Account: {}", e.getMessage());
        }
    }

    private final Map<String, String> verificationCodes = new HashMap<>();

//    private final Map<String, Boolean> verificationEmail = new HashMap<>();
    
    // 검증 코드 이메일 발송
    public String sendVerificationCode(String email) {
        String verificationCode = generateRandomCode(8);
        verificationCodes.put(email, verificationCode);
        logger.info("Verification code generated: {}", verificationCode);
        String title = MessageFormat.format("Verification Code: {0}", verificationCode);
        String content = MessageFormat.format("Wassu Verification Code: {1}", verificationCode);

        emailService.sendEmail(email, title, content);

        return "Verification Code sent to your email";
    }

//    // 인증 이메일 발송
//    public void sendVerificationEmail(String email) {
//        try {
//            verificationEmail.put(email, false);
//            String EmailLink = "http://localhost:8080/wassu/auth/verify-email/" + email;
//            log.info("Ready to send verification email");
//            String title = "대전 왔슈 인증 이메일입니다";
//            String content = MessageFormat.format("""
//                    <html>
//                    <body>
//                        <h2>안녕하세요, 대전 왔슈 인증 이메일입니다.</h2>
//                        <p>아래 링크를 클릭하셔서 인증하신 후 회원 가입을 계속 진행해주세요. </p>
//                        <a href="{0}">이메일 인증하기</a>
//                    </body>
//                    </html>
//                    """, EmailLink);
//
//            emailService.sendEmail(email, title, content);
//        } catch (Exception e) {
//            log.error("Exception in Send Verification Email: {}", e.getMessage());
//            throw new CustomException(CustomErrorCode.FAILED_TO_SEND_EMAIL);
//        }
//
//    }

    //로그아웃
    public void logout(String token) {
        BlackListEntity blacklistEntity = new BlackListEntity();
        blacklistEntity.setToken(token);
        blackListRepository.save(blacklistEntity);
    }

    // 랜덤 코드 생성
    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();

    }



    // 코드 검증
    public Boolean verifyCode(String email, String code) {
        String correctCode = verificationCodes.get(email);
        return correctCode != null && correctCode.equals(code);
    }

    public void removeVerificationCode(String email) {
        verificationCodes.remove(email);
    }

    public UserEntity convertToUserEntity(UserSignupDTO userSignupDTO) {
        return UserEntity.builder()
                .email(userSignupDTO.getEmail())
                .password(userSignupDTO.getPassword())
                .nickname(userSignupDTO.getNickname())
                .gender(userSignupDTO.getGender())
                .birthYear(userSignupDTO.getBirthYear())
                .build();
    }

}
