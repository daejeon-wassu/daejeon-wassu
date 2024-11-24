package com.wassu.wassu.service.user;

import com.wassu.wassu.dto.user.UserProfileUpdateDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.util.S3Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserProfileUpdateService {
    private final UserRepository userRepository;
    private final S3Util s3Util;

    public void updateProfile(UserEntity userEntity, UserProfileUpdateDTO userprofileUpdateDTO) {
        try {
            userEntity.setNickname(userprofileUpdateDTO.getNickName());
            userRepository.save(userEntity);
        } catch(Exception e) {
            log.error("Error updating user profile", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_UPDATE_PROFILE);
        }
    }

    public void updateProfileImage(UserEntity userEntity, MultipartFile profileImage) {
        try {
            String oldImages = userEntity.getProfileImage();
            log.warn("Start to delete profile image from s3");
            s3Util.deleteFile(oldImages);
            log.info("Deleted profile image from s3");
            String fileURL = s3Util.uploadFile(profileImage, "user");
            System.out.println("---------------");
            userEntity.setProfileImage(fileURL);
            userRepository.save(userEntity);
            log.info("Completed update profile image");

        } catch(Exception e) {
            log.error("Error updating user profile image", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_UPDATE_PROFILE_IMAGE);
        }
    }
}
