package com.wassu.wassu.service.user;

import com.wassu.wassu.config.AmazonS3Config;
import com.wassu.wassu.dto.user.UserProfileUpdateDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.dto.user.UserProfileDTO;
import com.wassu.wassu.dto.user.UserPasswordUpdateDTO;
import com.wassu.wassu.util.S3Util;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final PasswordEncoder passwordEncoder;
    private final S3Util s3Util;
    private final AmazonS3Config amazonS3Config;

    // 회원가입
    public UserEntity createUser(UserEntity userEntity) {
        if (userRepository.findByEmail(userEntity.getEmail()).isPresent()) {
            logger.error("Email already exists");
            throw new IllegalStateException("Email already exists");
        }
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userEntity.setProfileImage(
                String.format(
                        "https://%s.s3.%s.amazonaws.com/%s",
                        amazonS3Config.getBucket(),
                        amazonS3Config.getRegion(),
                        "default.png"
                )
        );

        return userRepository.save(userEntity);
    }
    
    // email 기반 유저 조회
    public UserProfileDTO findUserByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        return convertToDTO(user);
    }

    //비밀번호 변경
    public Boolean updateUserPassword(String email, UserPasswordUpdateDTO userPasswordUpdateDTO) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (passwordEncoder.matches(userPasswordUpdateDTO.getCurrentPassword(), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(userPasswordUpdateDTO.getNewPassword()));
                userRepository.save(user);
                log.info("Password updated");
                return true;
            } else {
                log.error("Password does not match");
                return false;
            }
        } else {
            logger.error("User does not exist while updating password");
            return false;
        }
    }

    public UserProfileDTO convertToDTO(UserEntity userEntity) {
        return UserProfileDTO.builder()
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .birthYear(userEntity.getBirthYear())
                .gender(userEntity.getGender())
                .exp(userEntity.getExp())
                .level(userEntity.getLevel())
                .profileImage(userEntity.getProfileImage())
                .build();
    }
}